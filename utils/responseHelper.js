export  const sendResponse = (req, res, code, message, data = {}) => {
    res.status(code).json({
        status: true,
        code: code,
        message: req.t(message),
        data: data,
    })
}
