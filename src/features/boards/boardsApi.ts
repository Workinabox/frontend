import axios from 'axios';
import { config } from '../../config.ts';
import type { Board } from './types.ts';
import { db, nextId, respond } from '../stub/db.ts';

export async function fetchBoards(projectId: string): Promise<Board[]> {
  if (config.useStub) {
    return respond(db.boards.filter((b) => b.project_id === projectId));
  }
  const { data } = await axios.get<Board[]>(
    `${config.apiBaseUrl}/projects/${projectId}/boards`,
  );
  return data;
}

export async function createBoard(
  projectId: string,
  body: { name: string; description: string },
): Promise<Board> {
  if (config.useStub) {
    const board: Board = { id: nextId('B', db.boards), project_id: projectId, ...body };
    db.boards.push(board);
    return respond(board);
  }
  const { data } = await axios.post<Board>(
    `${config.apiBaseUrl}/projects/${projectId}/boards`,
    body,
  );
  return data;
}

export async function updateBoard(
  id: string,
  body: { name: string; description: string },
): Promise<Board> {
  if (config.useStub) {
    const found = db.boards.find((b) => b.id === id)!;
    Object.assign(found, body);
    return respond(found);
  }
  const { data } = await axios.put<Board>(`${config.apiBaseUrl}/boards/${id}`, body);
  return data;
}
