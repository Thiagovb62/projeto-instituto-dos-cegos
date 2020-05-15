const Yup = require('yup');
const Assisted = require('../models/AssistedUser');

class AssistedController {
  async store(req, res) {
    const schema = Yup.object().shape({
      fullName: Yup.string().required(),
      socialName: Yup.string(),
      maritalStatus: Yup.string().required(),
      email: Yup.string().required(),
      phone: Yup.number().positive().required(),

      birth: Yup.date().required(),
      sex: Yup.string().required(),
      nationality: Yup.string().required(),
      placeOfBirth: Yup.string().required(),

      hasDeficiency: Yup.boolean().required(),
      deficiency: Yup.string(),

      address: Yup.object()
        .shape({
          address: Yup.string().required(),
          number: Yup.string().required(),
          neighborhood: Yup.string().required(),
          city: Yup.string().required(),
          state: Yup.string().required(),
          cep: Yup.number().positive().required(),
          referencePoint: Yup.string().required(),
        })
        .required(),

      identity: Yup.number().positive().required(),
      cpf: Yup.string().required(),
      issuingBody: Yup.string().required(),
      emission: Yup.date().required(),

      diagnostic: Yup.string().required(),
      visualAcuity: Yup.string().required(),
      cid10: Yup.string().required(),

      hasARelativeAttended: Yup.boolean().required(),
      relativeAttended: Yup.string(),

      transport: Yup.string().required(),

      isInGovernmentProgram: Yup.boolean().required(),
      governmentProgram: Yup.string(),
      governmentProgramValue: Yup.number().positive(),
      beneficiary: Yup.string(),
      nisNumber: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const assisted = await Assisted.create(req.body);

    return res.json(assisted);
  }

  async index(req, res) {
    const assisted = await Assisted.find();

    return res.json(assisted);
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.string().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const assisted = await Assisted.findById({ _id: req.params.id });

    return res.json(assisted);
  }

  async update(req, res) {
    return res.json();
  }

  async destroy(req, res) {
    const schema = Yup.object().shape({
      id: Yup.string().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    await Assisted.findByIdAndDelete({ _id: req.params.id });

    return res.json({ success: 'Successfully deleted' });
  }
}

module.exports = new AssistedController();
