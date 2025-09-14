const Mediafile = require('../models/mediafile.model')

const fs = require('fs-extra')
const path = require('path')

const { paginationDTO } = require('../models/default.dto')
const { log } = require('console')

module.exports.index = async (req, res) => {
  try {
    const page = req.query.page || paginationDTO.page
    const size = req.query.size || paginationDTO.size
    const mediafileList = await Mediafile.find({})
      .skip((page - 1) * size)
      .limit(size)
      .sort({ createdAt: -1 })
    const total = await Mediafile.countDocuments({})
    if (mediafileList.length === 0) {
      return res.json({
        code: 204,
        message: 'No Mediafile found',
      })
    }
    res.json({
      code: 200,
      message: 'Get data success',
      data: mediafileList,
      pagination: {
        total: total,
        size: size,
        page: page,
      },
    })
  } catch (error) {
    res.json({
      code: 400,
      error: error.message,
    })
  }
}

module.exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    const mediafile = await Mediafile.findById(id)

    if (!mediafile) {
      return res.json({
        code: 204,
        message: 'No MediaFile found',
      })
    }

    const filePath = path.join(__dirname, '..', mediafile.path)

    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath)
    }

    await mediafile.deleteOne()

    res.json({
      code: 200,
      message: 'Delete success',
      deletedFile: mediafile.path,
    })
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: error.message,
    })
  }
}

// module.exports.upload = async (req, res) => {
//   try {
//     console.log(req.body)

//     if (!req.files || req.files.length === 0 || !req.body.folder) {
//       return res.status(400).json({
//         code: 400,
//         message: 'Thiếu file hoặc folder',
//       })
//     }

//     const folderPath = path.join(__dirname, '../public', req.body.folder)
//     await fs.ensureDir(folderPath)

//     const uploadedFiles = []
//     for (const file of req.files) {
//       const timestamp = Date.now()
//       const fileExtension = path.extname(file.originalname)
//       const newFileName = `${timestamp}${fileExtension}`
//       const filePath = path.join(folderPath, newFileName)

//       await fs.writeFile(filePath, file.buffer)

//       const filePublicPath = `public/${req.body.folder}/${newFileName}`

//       const newMediaFile = await Mediafile.create({
//         title: req.body.title || '',
//         description: req.body.description || '',
//         thumbnail: req.body.thumbnail || '',
//         type: file.mimetype,
//         size: file.size,
//         path: filePublicPath,
//         created_by: req.body.created_by,
//         position: req.body.position || null,
//         scale: JSON.parse(req.body.scale||null) || null
//       })

//       uploadedFiles.push({
//         filename: newFileName,
//         path: filePublicPath,
//         type: file.mimetype,
//         size: file.size,
//       })
//     }

//     res.json({
//       code: 200,
//       message: 'Upload success',
//       files: uploadedFiles,
//     })
//   } catch (error) {
//     res.status(500).json({
//       code: 500,
//       error: error.message,
//     })
//   }
// }

function sanitizeFolder(input = '') {
  // chặn .. và backslash, chuẩn hoá thành tên thư mục "an toàn"
  return String(input)
    .replace(/(\.\.)+/g, '')
    .replace(/[\\]+/g, '/')
    .replace(/\/+/g, '/')
    .replace(/^\/|\/$/g, '');
}

function parseJSONSafe(v, fallback = null) {
  try {
    if (v === undefined || v === null || v === '') return fallback;
    return JSON.parse(v);
  } catch {
    return fallback;
  }
}

module.exports.upload = async (req, res) => {
  try {
    // Log nhẹ để kiểm tra
    // console.log('body:', req.body);

    if (!req.files || req.files.length === 0 || !req.body.folder) {
      return res.status(400).json({
        code: 400,
        message: 'Thiếu file hoặc folder',
      });
    }

    const safeFolder = sanitizeFolder(req.body.folder);
    const folderPath = path.join(__dirname, '../public', safeFolder);
    await fs.ensureDir(folderPath);

    // Parse trường scale an toàn (có thể là JSON string)
    const scaleObj = parseJSONSafe(req.body.scale, null);

    const uploadedFiles = [];

    for (const file of req.files) {
      const ext = path.extname(file.originalname || '').toLowerCase();
      const baseName = `${Date.now()}-${Math.floor(Math.random() * 1e6)}${ext}`;
      const finalFsPath = path.join(folderPath, baseName);

      // Nếu dùng diskStorage => có file.path (tập tin tạm ở /tmp)
      // Nếu dùng memoryStorage => có file.buffer
      if (file.path) {
        await fs.move(file.path, finalFsPath, { overwrite: true });
      } else if (file.buffer) {
        // KHÔNG KHUYẾN NGHỊ cho file lớn, nhưng vẫn hỗ trợ để không vỡ flow
        await fs.writeFile(finalFsPath, file.buffer);
      } else {
        return res.status(400).json({ code: 400, message: 'Không tìm thấy dữ liệu file hợp lệ' });
      }

      // Đường dẫn public POSIX (dùng /)
      const publicPath = path.posix.join('public', safeFolder, baseName);

      // Lưu DB
      const newMediaFile = await Mediafile.create({
        title: req.body.title || '',
        description: req.body.description || '',
        thumbnail: req.body.thumbnail || '',
        type: file.mimetype,
        size: file.size,
        path: publicPath,
        created_by: req.body.created_by, // đảm bảo phía client gửi đúng ObjectId (không phải "0000")
        position: req.body.position || null,
        scale: scaleObj,
      });

      uploadedFiles.push({
        id: newMediaFile?._id,
        filename: baseName,
        path: publicPath,
        type: file.mimetype,
        size: file.size,
        url: `https://chinsudev.xyz/${publicPath}`, // nếu Nginx/Express đang serve /public
      });
    }

    return res.json({
      code: 200,
      message: 'Upload success',
      files: uploadedFiles,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      code: 500,
      error: error.message,
    });
  }
};