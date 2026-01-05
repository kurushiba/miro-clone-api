import { Router, Request, Response } from 'express';
import datasource from '../../datasource';
import { BoardObject, BoardObjectType } from './board-object.entity';
import { Board } from '../boards/board.entity';

const boardObjectController = Router();
const boardObjectRepository = datasource.getRepository(BoardObject);
const boardRepository = datasource.getRepository(Board);

// オブジェクト一覧取得
boardObjectController.get('/:boardId', async (req: Request, res: Response) => {
  try {
    if (!req.currentUser) {
      res.status(401).json({ message: '認証が必要です' });
      return;
    }

    const { boardId } = req.params;

    // ボードの存在確認と権限チェック
    const board = await boardRepository.findOne({ where: { id: boardId } });
    if (!board) {
      res.status(404).json({ message: 'ボードが見つかりません' });
      return;
    }

    const objects = await boardObjectRepository.find({
      where: { boardId },
      order: { createdAt: 'ASC' },
    });

    res.status(200).json(objects);
  } catch (error) {
    console.error('オブジェクト一覧取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// オブジェクト作成
boardObjectController.post('/:boardId', async (req: Request, res: Response) => {
  try {
    if (!req.currentUser) {
      res.status(401).json({ message: '認証が必要です' });
      return;
    }

    const { boardId } = req.params;
    const { type, x, y, width, height, content, color } = req.body;

    // ボードの存在確認
    const board = await boardRepository.findOne({ where: { id: boardId } });
    if (!board) {
      res.status(404).json({ message: 'ボードが見つかりません' });
      return;
    }

    const object = await boardObjectRepository.save({
      boardId,
      type: type || BoardObjectType.STICKY,
      x,
      y,
      width,
      height,
      content: content || '',
      color,
    });

    res.status(200).json(object);
  } catch (error) {
    console.error('オブジェクト作成エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// オブジェクト更新
boardObjectController.patch('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.currentUser) {
      res.status(401).json({ message: '認証が必要です' });
      return;
    }

    const { id } = req.params;
    const { x, y, width, height, content, color } = req.body;

    const object = await boardObjectRepository.findOne({ where: { id } });

    if (!object) {
      res.status(404).json({ message: 'オブジェクトが見つかりません' });
      return;
    }

    // 更新するフィールドのみを適用
    if (x !== undefined) object.x = x;
    if (y !== undefined) object.y = y;
    if (width !== undefined) object.width = width;
    if (height !== undefined) object.height = height;
    if (content !== undefined) object.content = content;
    if (color !== undefined) object.color = color;

    const updatedObject = await boardObjectRepository.save(object);

    res.status(200).json(updatedObject);
  } catch (error) {
    console.error('オブジェクト更新エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// オブジェクト削除
// DELETEリクエストはオブジェクトIDを指定しますが、パスは /:id となります
// ユーザー要望の "/:boardId" (DELETE) はコンテキスト的にオブジェクト削除と思われるため、
// IDはオブジェクトIDとして扱います。
boardObjectController.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.currentUser) {
      res.status(401).json({ message: '認証が必要です' });
      return;
    }

    const { id } = req.params;
    const object = await boardObjectRepository.findOne({ where: { id } });

    if (!object) {
      res.status(404).json({ message: 'オブジェクトが見つかりません' });
      return;
    }

    await boardObjectRepository.remove(object);
    res.status(204).send();
  } catch (error) {
    console.error('オブジェクト削除エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export default boardObjectController;
