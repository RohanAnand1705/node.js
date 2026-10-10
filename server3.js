import {createServer} from 'http';
const PORT = 5000;

const assignments = [
    {id :1, title :'Linked list'},
    {id : 2, title: 'Stack'},
    {id :3, title : 'Queue'},
];

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const jsonMiddleware = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
};

const getAssignmentHandler = (req, res) => {
    res.setHeader('Content-Type','application/json');
    res.write(JSON.stringify(assignments));
    res.end();
};

const getAssignmentByIDHandler = (req, res) => {
    const id= req.url.split('/')[3];
    const assignment = assignments.find((assignment)=>assignment.id===parseInt(id));
    if(assignment){
        res.write(JSON.stringify(assignment));
    }else{
        res.statusCode = 404;
        res.write(JSON.stringify({message: 'Assignment not Found'}));
    }res.end();
};

const createAssignmentHandler = (req, res)=>{
    let body ='';
    req.on('data',(chunk)=>{
        body+=chunk.toString();
    });
    req.on('end',()=> {
        const newAssignment= JSON.parse(body);
        assignments.push(newAssignment);
        res.statusCode = 201;
        res.write(JSON.stringify(newAssignment));
        res.end();
    });
};

const deleteAssignmentHandler = (req,res)=>{
    const id= parseInt(req.url.split('/')[3]);
    const index = assignments.findIndex((assignment)=>assignment.id===id);
    if(index!==-1){
        const deleted = assignments.splice(index,1);
        res.end(JSON.stringify(deleted[0]));
    }else{
        res.statusCode = 404;
        res.end(JSON.stringify({message: 'Assignment not Found'}));
    }
}


const updateAssignmentHandler = (req, res) => {
    const id = parseInt(req.url.split('/')[3]);
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const updatedAssignment = JSON.parse(body);

            const index = assignments.findIndex(
                (assignment) => assignment.id === id
            );

            res.setHeader('Content-Type', 'application/json');

            if (index === -1) {
                res.statusCode = 404;
                return res.end(JSON.stringify({
                    message: 'Assignment not Found'
                }));
            }

            if (updatedAssignment.id !== id) {
                res.statusCode = 400;
                return res.end(JSON.stringify({
                    message: 'ID in body must match URL'
                }));
            }

            assignments[index] = updatedAssignment;
            res.statusCode = 200;
            res.end(JSON.stringify(updatedAssignment));

        } catch (error) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                message: 'Invalid JSON'
            }));
        }
    });
};


const server = createServer((req, res) => {
    logger(req, res, () => {
    jsonMiddleware(req, res, () => {
    if(req.url === '/api/assignments' && req.method === 'GET'){
        getAssignmentHandler(req, res);
    }

    else if(req.url.startsWith('/api/assignments/') && req.method === 'GET'){
        getAssignmentByIDHandler(req, res);
    }

    else if(req.url === '/api/assignments' && req.method === 'POST'){
        createAssignmentHandler(req, res);
    }

    else if(req.url.startsWith('/api/assignments/') && req.method === 'DELETE'){
        deleteAssignmentHandler(req, res);
    }

    else if (
    req.url.startsWith('/api/assignments/') &&
    req.method === 'PUT'
) {
    updateAssignmentHandler(req, res);
}
    else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Route not Found' }));
}
});
    });
});


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});