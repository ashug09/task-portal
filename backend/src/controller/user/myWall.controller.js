import MyWall from "../../models/user/myWall.model.js";
const createMyWall = async (req, res) => {
    try {
        const body = req.body;
        const myWall = new MyWall(body);
        await myWall.save();
        res.status(201).json(myWall);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
const showMyWall = async (req, res) => {
    try {
        const body = req.body;
        //here id would be user id, id of the user
        const myWall = await MyWall.find(body.userId);

        res.status(200).json(myWall);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
const updateMyWall = async (req, res) => {
    try {
        const body = req.body;
        const myWall = await MyWall.findByIdAndUpdate(body.userId, body, { new: true });
        res.status(200).json(myWall);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
export { createMyWall, showMyWall, updateMyWall }