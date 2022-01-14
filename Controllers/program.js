
const program = [
    {
        name: "Basics of Python",
        description: "python introduction",
        price: 300,
        venue: "Microsoft Teams",
        date: Date.now(),
        typeOfProgram: "workshop",
        DateOfCreation: Date.now()
    },
    {
        name: "Basics of Python",
        description: "python introduction",
        price: 300,
        venue: "Microsoft Teams",
        date: Date.now(),
        typeOfProgram: "workshop",
        DateOfCreation: Date.now()
    },
    {
        name: "Basics of Python",
        description: "python introduction",
        price: 300,
        venue: "Microsoft Teams",
        date: Date.now(),
        typeOfProgram: "workshop",
        DateOfCreation: Date.now()
    }
]

const getPrograms = (req,res)=>{
    res.status(200).json(program);
}

module.exports = {getPrograms};