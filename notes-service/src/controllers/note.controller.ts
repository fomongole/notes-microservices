import { Request, Response, NextFunction } from 'express';
import * as NoteService from '../services/note.service';
import { AppError } from '../utils/AppError';

export const createNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!._id; // ! asserts it exists (checked by protect)
        const note = await NoteService.createNote(userId, req.body);
        res.status(201).json({ status: 'success', data: { note } });
    } catch (error) { next(error); }
};

export const getAllNotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!._id;
        const result = await NoteService.getNotes(userId, req.query);
        res.status(200).json({
            status: 'success',
            results: result.notes.length,
            data: {
                notes: result.notes,
                pagination: { total: result.total, page: result.page, pages: result.pages }
            }
        });
    } catch (error) { next(error); }
};

export const getNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!._id;
        const note = await NoteService.getNoteById(userId, req.params.id as string);
        res.status(200).json({ status: 'success', data: { note } });
    } catch (error: any) { next(new AppError(error.message, 404)); }
};

export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!._id;
        const note = await NoteService.updateNote(userId, req.params.id as string, req.body);
        res.status(200).json({ status: 'success', data: { note } });
    } catch (error: any) { next(new AppError(error.message, 404)); }
};

export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!._id;
        await NoteService.deleteNote(userId, req.params.id as string);
        res.status(204).json({ status: 'success', data: null });
    } catch (error: any) { next(new AppError(error.message, 404)); }
};