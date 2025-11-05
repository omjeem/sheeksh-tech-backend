import z from "zod";

export class Class {
    static create = z.object({
        name : z.string()
    })
}