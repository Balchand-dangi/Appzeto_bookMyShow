// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`, err.stack);

    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    return res.status(status).json({
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;
