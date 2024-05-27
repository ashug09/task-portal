import Personal from "../../models/user/personal.model.js";
const createPersonal = async (req, res) => {
  try {
    const body = req.body;
    const personal = new Personal(body);
    await personal.save();
    res.status(201).json(personal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getPersonal = async (req, res) => {
  try {
    const body = req.body;
    const personal = await Personal.findOne({ email: body.email });
    res.status(200).json(personal);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
const updatePersonal = async (req, res) => {
  try {
    const body = req.body;
    const personal = await Personal.findOneAndUpdate({ email: body.email }, body, { new: true });
    res.status(200).json(personal);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
export { createPersonal, getPersonal, updatePersonal };
