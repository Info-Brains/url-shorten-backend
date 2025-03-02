import joi from 'joi';

const paginationSchema = joi.object({
    page: joi.number().min(1).default(1),
    limit: joi.number().min(1).max(100).default(10),
})

export default {
    paginationSchema
}
