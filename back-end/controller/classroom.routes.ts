/**
 * @swagger
 *   components:
 *    securitySchemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *    schemas:
 *      Classroom:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            name:
 *              type: string
 *              description: Classroom name.
 *      ClassroomInput:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *              description: Classroom name.
 */

import express, { NextFunction, Request, Response } from 'express';
import classroomService from '../service/classroom.service';
import { ClassroomInput } from '../types';

const classroomRouter = express.Router();

/**
 * @swagger
 * /classrooms/{name}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get classroom with name
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The classroom name.
 *     responses:
 *       200:
 *         description: Classroom with name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Classroom'
 */
classroomRouter.get('/:name', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const name = req.params.name;
        const classroom = await classroomService.getClassroomByName(name);
        res.status(200).json(classroom);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /classrooms:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a classroom
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClassroomInput'
 *     responses:
 *       201:
 *         description: Classroom added to database.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Classroom'
 */
classroomRouter.post(
    '/',
    async (req: Request & { auth: any }, res: Response, next: NextFunction) => {
        try {
            const { role } = req.auth;
            const classroom = <ClassroomInput>req.body;
            const result = await classroomService.createClassroom(classroom, { role });
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },
);

export { classroomRouter };
