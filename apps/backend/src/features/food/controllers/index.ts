//my changes begin here
import Repository from "@/features/auth/repository";
import type { Request, Response } from "express";


export async function listFoods(req: Request, res: Response) {
    const { categories, limit, offset } = req.query;
    const result = await Repository.listFoods({
        categories: categories ? categories.split(",") : undefined,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
    });
    if (result.isErr) {
        return res.status(500).json({ error: "UNEXPECTED_ERROR" });
    }
    return res.status(200).json(result.value);
}


export async function createFood(req: Request, res: Response) {
    const result = await Repository.createFood(req.body);
    if (result.isErr) {
        return res.status(500).json({ error: "UNEXPECTED_ERROR" });
    }
    return res.status(201).json(result.value);
}

export async function getFoodById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await Repository.findFoodById({ id });
    if (result.isErr) {
        return res.status(500).json({ error: "UNEXPECTED_ERROR" });
    }
    if (!result.value) {
        return res.status(404).json({ error: "EXPECTED_FOOD_NOT_FOUND" });
    }
    return res.status(200).json(result.value);
}


export async function updateFoodById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await Repository.updateFoodById(id, req.body);
    if (result.isErr) {
        return res.status(500).json({ error: "UNEXPECTED_ERROR" });
    }
    return res.status(200).json(result.value);
}


export async function deleteFoodById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await Repository.deleteFoodById({ id });
    if (result.isErr) {
        return res.status(500).json({ error: "UNEXPECTED_ERROR" });
    }
    return res.status(200).json({ code: "FOOD_DELETED" });
}
//My changes end here