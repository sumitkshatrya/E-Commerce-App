import jwt from 'jsonwebtoken'

const optionalAuth = async (req, res, next) => {
  const { token } = req.headers

  if (!token) {
    return next()
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
  } catch (error) {
    console.log(error)
  }

  next()
}

export default optionalAuth
