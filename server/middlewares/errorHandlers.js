const errorHandlers = (error, req, res, next) => {
    console.log(error)

    let status = 500
    let message = "Internal server error"
}

module.exports = errorHandlers