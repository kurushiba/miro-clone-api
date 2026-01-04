import { Router, Request, Response } from 'express';
import datasource from '../../datasource';
import { Board } from './board.entity';

const boardController = Router();
const boardRepository = datasource.getRepository(Board);

// ボード一覧取得
boardController.get('/', async (req: Request, res: Response) => {
  try {
    if (!req.currentUser) {
      res.status(401).json({ message: '認証が必要です' });
      return;
    }

    const boards = await boardRepository.find({
      where: { ownerId: req.currentUser.id },
      order: { createdAt: 'DESC' },
    });

    res.status(200).json(boards);
  } catch (error) {
    console.error('ボード一覧取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ボード作成
boardController.post('/', async (req: Request, res: Response) => {
  try {
    if (!req.currentUser) {
      res.status(401).json({ message: '認証が必要です' });
      return;
    }

    const { name } = req.body;
    // 名前が指定されていない場合はデフォルト名を使用するなどの処理も可能だが、
    // ここでは必須チェックはせず、空なら空文字あるいはフロント側で制御する前提、
    // またはデフォルト名をつける
    const boardName = name || '名称未設定のボード';

    const board = await boardRepository.save({
      name: boardName,
      ownerId: req.currentUser.id,
    });

    res.status(200).json(board);
  } catch (error) {
    console.error('ボード作成エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ボード削除
boardController.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.currentUser) {
      res.status(401).json({ message: '認証が必要です' });
      return;
    }

    const { id } = req.params;
    const board = await boardRepository.findOne({
      where: { id, ownerId: req.currentUser.id },
    });

    if (!board) {
      res.status(404).json({ message: 'ボードが見つかりません' });
      return;
    }

    await boardRepository.remove(board);
    res.status(204).send();
  } catch (error) {
    console.error('ボード削除エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export default boardController;
