import app from './src/api/app';

// set port and listen
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Go to localhost:${PORT}/`);
});
