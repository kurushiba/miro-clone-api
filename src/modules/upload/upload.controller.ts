import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadController = Router();

// アップロード先のディレクトリ設定
const UPLOAD_DIR = 'uploads';

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // ユニークなファイル名を生成 (タイムスタンプ + ランダムな数値 + オリジナルの拡張子)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB制限
  },
  fileFilter: (req, file, cb) => {
    // 画像ファイルのみ許可
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

uploadController.post(
  '/',
  upload.single('file'),
  (req: Request, res: Response) => {
    if (!req.file) {
      res
        .status(400)
        .json({
          message:
            'ファイルがアップロードされていません、または許可されていないファイル形式です。',
        });
      return;
    }

    // クライアントからアクセス可能なURLを返す
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${
      req.file.filename
    }`;

    res.status(200).json({
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
    });
  }
);

export default uploadController;
