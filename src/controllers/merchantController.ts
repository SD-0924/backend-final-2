import { Request, Response } from "express";
import MerchantService from "../services/merchantService";
import Joi from "joi";

// Validation schema
const merchantSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    businessAddress: Joi.string().trim().min(5).max(100).required(),
    businessName: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().email().trim().lowercase().required(),
    role: Joi.string().valid('admin', 'manager', 'staff').required(),
    phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)  // E.164 format
    .required()
    .messages({
        'string.pattern.base': 'Phone number must be in international format (e.g., +14155552671)'
    }),
    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        })
});

export const createMerchant = async (req: Request, res: Response): Promise<Response>  => {
    try {
        // Validate request body
        const { error } = merchantSchema.validate(req.body);
        
        if (error) {
            return res.status(400).json({
                status: 'error',
                message: error.details[0].message
            });
        }

        const merchant = req.body;
        const result = await MerchantService.createUser(merchant);
        
        return res.status(201).json({
            status: 'success',
            // data: result, for testing purposes only
            message: 'Merchant created successfully'
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            details: error
        });
    }
};