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
        // Flatten the error response to prevent nesting
        const errorMessage = error.response?.data?.error?.message || 'An error occurred';
        res.status(500).json({
            error: {
                code: error.response?.status || 500,
                message: errorMessage
            }
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
