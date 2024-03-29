const Pet = require('../models/Pet');

//helpers
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const { update } = require('../models/Pet');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = class PetController {
    //create a pet
    static async create(req, res) {
        const { name, age, weight, color } = req.body;
        const images = req.files;
        const available = true;

        //images upload

        //validations
        if (!name) {
            res.status(422).json({ message: 'Nome obrigatório' });
            return;
        }

        if (!age) {
            res.status(422).json({ message: 'Idade obrigatória' });
            return;
        }

        if (!weight) {
            res.status(422).json({ message: 'Peso obrigatório' });
            return;
        }

        if (!color) {
            res.status(422).json({ message: 'Cor obrigatória' });
            return;
        }

        if (images.length === 0) {
            res.status(422).json({ message: 'Imagem obrigatória' });
            return;
        }

        //get pet owner
        const token = getToken(req);
        const user = await getUserByToken(token);

        //create a pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone
            }
        })

        images.map((image) => {
            pet.images.push(image.filename);
        })

        try {
            const newPet = await pet.save();
            res.status(201).json({ message: "Pet cadastrado com sucesso!", newPet });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async getAll(req, res) {
        const pets = await Pet.find().sort('-createdAt');
        res.status(200).json({ pets: pets })
    }

    static async getAllUserPets(req, res) {
        //get user from token
        const token = getToken(req);
        const user = await getUserByToken(token);
        const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt');

        res.status(200).json({ pets });
    }

    static async getAllUserAdoptions(req, res) {
        const token = getToken(req);
        const user = await getUserByToken(token);
        const pets = await Pet.find({ 'adopter._id': user._id }).sort('-createdAt');

        res.status(200).json({ pets })
    }

    static async getPetById(req, res) {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido' });
            return;
        }

        //check if pet exists
        const pet = await Pet.findOne({ _id: id });

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado' });
        }

        res.status(200).json({ pet: pet });
    }

    static async removePetById(req, res) {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'Id inválido!' });
            return;
        }

        const pet = await Pet.findOne({ _id: id });

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' });
            return;
        }

        const token = getToken(req);
        const user = await getUserByToken(token);

        console.log(pet.user._id);
        console.log(user);

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema ao solicitar sua solicitação. Tente novamente mais tarde!' });
            return;
        }

        await Pet.findByIdAndRemove(id);

        res.status(200).json({ message: 'Pet removido com sucesso' });
    }

    static async updatePet(req, res) {
        const id = req.params.id;
        const { name, age, weight, color, available } = req.body;
        const images = req.files;
        const updatedData = {};

        const pet = await Pet.findOne({ _id: id });

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' });
            return;
        }

        const token = getToken(req);
        const user = await getUserByToken(token);

        console.log(pet.user._id);
        console.log(user._id);

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema ao solicitar sua solicitação. Tente novamente mais tarde!' });
            return;
        }

        if (!name) {
            res.status(422).json({ message: 'Nome Obrigatório' });
            return;
        } else {
            updatedData.name = name;
        }

        if (!age) {
            res.status(422).json({ message: 'Idade obrigatória' });
            return;
        } else {
            updatedData.age = age;
        }

        if (!weight) {
            res.status(422).json({ message: 'Peso obrigatório' });
            return;
        } else {
            updatedData.weight = weight;
        }

        if (!color) {
            res.status(422).json({ message: 'Cor obrigatória' });
            return;
        } else {
            updatedData.color = color;
        }

        if (images.length > 0) {
            updatedData.images = [];
            images.map((image) => {
                updatedData.images.push(image.filename);
            })
        }

        await Pet.findByIdAndUpdate(id, updatedData)
        res.status(200).json({ message: 'Pet atualizado com sucesso!' });
        return;
    }

    static async schedule(req, res) {
        const id = req.params.id;

        //check if pet exists
        const pet = await Pet.findOne({ _id: id });

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado.' });
            return;
        }

        //check if the pet is from the own user
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (pet.user._id.equals(user._id)) {
            res.status(422).json({ message: 'Você não pode agendar uma visita para o seu próprio pet.' });
            return;
        }

        //check if user has already schedule a visit
        if (pet.adopter) {
            if (pet.adopter._id.equals(user._id)) {
                res.status(422).json({ message: 'Você já agendou uma visita para este pet.' });
                return;
            }
        }

        //add user to pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Pet.findByIdAndUpdate(id, pet);
        res.status(200).json({ message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}.` });
    }

    static async concludeAdoption(req, res) {
        const id = req.params.id;

        //check if pet exists
        const pet = await Pet.findOne({ _id: id });

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado.' });
            return;
        }

        const token = getToken(req);
        const user = await getUserByToken(token);

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema ao solicitar sua solicitação. Tente novamente mais tarde!' });
            return;
        }

        pet.available = false;
        await Pet.findByIdAndUpdate(id, pet);
        res.status(200).json({ message: 'Parabéns! O ciclo de adoção foi finalizado com sucesso' });
        return;
    }
}