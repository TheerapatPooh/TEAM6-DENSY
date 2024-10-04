import  { prisma } from '../Utils/database'
import  { Request, Response } from 'express'

export async function getPreset(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10); 
        const preset = await prisma.preset.findUnique({
            where: { id },
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

export async function getAllPresets(req: Request, res: Response) {
    try {
        // Fetch all presets from the database
        const presets = await prisma.preset.findMany({
            include:{
                checklist:{
                    include:{
                        checklist:true
                    }

                }
            }
        });
        
        // Check if presets were found
        if (presets.length > 0) {
            res.send(presets); // Send the list of presets
        } else {
            res.status(404).send('No presets found'); // No presets available
        }
    } catch (err) {
        res.status(500).send(err); // Handle any errors
    }
}