import express from 'express';
import { config } from 'dotenv';
import axios from 'axios';
import xss from 'xss-clean'

config()

const app = express();
const PORT = process.env.PORT || 3001;

app.use(xss())

app.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(process.env.URL, {
            headers: {
                'redirect-server': 'true'
            },
            data: {
                shortid: id
            }
        });

        if (response.data.url) {
            return res.redirect(response.data.url);
        }
    } catch (error) {
        res.status(500).json({
            status: error.response?.status,
            data: error.response?.data
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
