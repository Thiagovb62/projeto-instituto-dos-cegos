const Yup = require('yup')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

class UserController {
    async store(req, res, next) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().required(),
            password: Yup.string().required(),
        })

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ message: 'Format invalid' })
        }

        const { name, email, password } = req.body

        const exists = await User.findOne({ email })

        if (exists) {
            return res
                .status(401)
                .json({ message: 'email alredy exists, try again' })
        }

        const password_hash = await bcrypt.hash(password, 9)

        const user = new User({ name, email, password_hash })
        user.save()

        return res.status(201).json({ user })
    }

    async index(req, res, next) {
        const users = await User.find({}, { password_hash: 0 })
        if (!users) {
            return res.status(400).json({ message: "Users don't exists!" })
        }

        return res.status(200).json({ users })
    }

    async show(req, res, next) {
        const { email } = req.params

        const user = await User.findOne({ email }, { password_hash: 0 })
        if (!user) {
            return res.status(400).json({ message: "User don't exists!" })
        }

        return res.status(200).json({ user })
    }
}

module.exports = new UserController()
