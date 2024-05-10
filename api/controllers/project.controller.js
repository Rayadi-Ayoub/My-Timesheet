import Projet from '../models/project.model.js'

export const createProject = async (req,res) =>{
    try {
        const projet = new Projet(req.body)
        const data = projet.save()
        res.status(201).json(data);
    }
    catch (error) {
        res.status(500).json({
            message:error
        })
    }
}

export const getProjects = async (req,res) =>{
    try {
        const Projets = await Projet.find({}).populate('employee').populate('taches').populate('pole').populate('societe_concernes').populate('creator');
        res.status(200).json({
            data:Projets
        })
    } catch (error) {
        res.status(500).json({
            message:error
        })
    }

}
export const getProjectById = async(req,res) =>{
    try {
        const proj =await Projet.findById(req.params.id).populate('employee').populate('taches').populate('pole').populate('societe_concernes').populate('creator');
        res.status(200).json({
            data: proj,
        })
    } catch (error) {
        res.status(500).send('Error' + error)
    }
}

export const deleteProject = async (req, res) => {
    try {
        await Projet.findByIdAndDelete(req.params.id);
        res.status(200).json({
            data: null,
            message: 'projet supprimé avec succés'
        });
    } catch (error) {
        res.status(500).send('Error' + error)
    }
}


export const updateProject = async (req,res) => {
    try {
        const proj = await Projet.findByIdAndUpdate(req.params.id,req.body)
        res.status(200).json(
            {data:proj,message:"updated projet succés"}
        )
    } catch (error) {
        res.status(500).send('Error' + error)
    }
}