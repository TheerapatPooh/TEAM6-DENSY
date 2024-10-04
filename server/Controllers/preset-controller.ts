import  { prisma } from '../Utils/database'
import  { Request, Response } from 'express'

export async function getPreset(req: Request, res: Response) {
    try {
        const presetId = parseInt(req.params.id, 10); 
        const preset = await prisma.preset.findUnique({
            where: { ps_id: presetId },
        })
        if (preset) {
            res.send(preset);
        } else {
            res.status(404).send('Preset not found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
}