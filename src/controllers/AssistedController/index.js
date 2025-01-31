const Yup = require('yup');
const Assisted = require('@models/AssistedUser');
const MemberFamily = require('@models/MemberFamily');
const ReturnByType = require('@service/ReturnAllAssistedByTypeService');
const ReturnByTypeAndEdit = require('@service/ReturnAssistedByTypeService');
const ReturnByTypeAndDelete = require('@service/ReturnAssistedByTypeAndDeleteService');

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

      address: Yup.object().shape({
        address: Yup.string(),
        number: Yup.string(),
        neighborhood: Yup.string(),
        city: Yup.string(),
        state: Yup.string(),
        cep: Yup.number().positive(),
        referencePoint: Yup.string(),
      }),

      identity: Yup.number().positive().required(),
      cpf: Yup.string().required(),
      Department: Yup.string().required(),
      emission: Yup.date().required(),

      diagnostic: Yup.string(),
      visualAcuity: Yup.string(),
      cid10: Yup.string(),

      hasARelativeAttended: Yup.boolean().required(),
      relativeAttended: Yup.string(),

      transport: Yup.string(),

      isInGovernmentProgram: Yup.boolean(),
      governmentProgram: Yup.string(),
      governmentProgramValue: Yup.number().positive(),
      beneficiary: Yup.string(),
      nisNumber: Yup.number().positive(),

      schooling: Yup.object().shape({
        grade: Yup.string(),
        turn: Yup.string(),
        hasVinculeHelioGoes: Yup.boolean(),
        transportToInstitute: Yup.string(),
        hasMemberMatriculatedOrWillMatriculate: Yup.boolean(),
      }),

      property: Yup.object().shape({
        type_property: Yup.string(),
        physical_structure: Yup.string(),
        numberOfRooms: Yup.number().positive(),
        numberOfBathrooms: Yup.number().positive(),
        energyElectric: Yup.string(),
        waterSupply: Yup.string(),
        sanitarySewage: Yup.boolean(),
        garbageCollection: Yup.boolean(),
        statusProperty: Yup.string(),
        monthlyRent: Yup.number().positive(),
        monthlyFinancing: Yup.number().positive(),
        isSharedWithOtherFamily: Yup.boolean(),
        houseProvidedBy: Yup.string(),
      }),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    try {
      const assisted = await Assisted.create(req.body);
      return res.json(assisted);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }

  async index(req, res) {
    const assisted = await Assisted.find();

    return res.json(assisted);
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.string().required(),
    });

    const { type } = req.query;

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const assisted = await ReturnByType.exec(type, req.params.id);

    if (assisted === null) {
      return res.status(400).json({ message: "user don't exists!" });
    }

    return res.status(200).json({ assisted });
  }

  async update(req, res) {
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

      address: Yup.object().shape({
        address: Yup.string(),
        number: Yup.string(),
        neighborhood: Yup.string(),
        city: Yup.string(),
        state: Yup.string(),
        cep: Yup.number().positive(),
        referencePoint: Yup.string(),
      }),

      identity: Yup.number().positive().required(),
      cpf: Yup.string(),
      Department: Yup.string().required(),
      emission: Yup.date().required(),

      diagnostic: Yup.string(),
      visualAcuity: Yup.string(),
      cid10: Yup.string(),

      hasARelativeAttended: Yup.boolean().required(),
      relativeAttended: Yup.string(),

      transport: Yup.string(),

      isInGovernmentProgram: Yup.boolean(),
      governmentProgram: Yup.string(),
      governmentProgramValue: Yup.number().positive(),
      beneficiary: Yup.string(),
      nisNumber: Yup.number().positive(),

      schooling: Yup.object().shape({
        grade: Yup.string(),
        turn: Yup.string(),
        hasVinculeHelioGoes: Yup.boolean(),
        transportToInstitute: Yup.string(),
        hasMemberMatriculatedOrWillMatriculate: Yup.boolean(),
      }),

      property: Yup.object().shape({
        type_property: Yup.string(),
        physical_structure: Yup.string(),
        numberOfRooms: Yup.number().positive(),
        numberOfBathrooms: Yup.number().positive(),
        energyElectric: Yup.string(),
        waterSupply: Yup.string(),
        sanitarySewage: Yup.boolean(),
        garbageCollection: Yup.boolean(),
        statusProperty: Yup.string(),
        monthlyRent: Yup.number().positive(),
        monthlyFinancing: Yup.number().positive(),
        isSharedWithOtherFamily: Yup.boolean(),
        houseProvidedBy: Yup.string(),
      }),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Id not received' });
    }

    const { type } = req.query;

    const assisted = await ReturnByTypeAndEdit.exec(type, req.params.id);

    if (assisted === null) {
      return res.status(400).json({ message: "user don't exists!" });
    }
    try {
      assisted.set(req.body);
      await assisted.save();

      return res.json(assisted);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }

  async destroy(req, res) {
    const schema = Yup.object().shape({
      id: Yup.string().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Id not received' });
    }

    const { type } = req.query;
    const { destroy_members } = req.query;

    const assisted = await ReturnByTypeAndDelete.exec(type, req.params.id);

    if (assisted === null) {
      return res.status(400).json({ message: "user don't exists!" });
    }

    if (destroy_members) {
      const members = await MemberFamily.find({
        idAssisted: assisted.id,
      });

      await members.forEach(member => {
        member.remove();
      });
    }

    return res.json({ success: 'Successfully deleted' });
  }
}

module.exports = new AssistedController();
