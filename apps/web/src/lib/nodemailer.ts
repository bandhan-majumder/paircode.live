import { feedBackFormSchema } from '@/types/feedback.type'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_EMAIL_PASS,
    },
})

async function sendEmail(data: any): Promise<void> {
    const parsedData = feedBackFormSchema.safeParse(data)

    if (!parsedData.success) {
        console.error('Invalid feedback form data:', parsedData.error)
        return
    };

    const { name, email, category, message } = parsedData.data;

    try {
        await transporter.sendMail({
            from: {
                name: 'PairCode.live',
                address: process.env.USER_EMAIL || 'default@example.com',
            },
            to: [process.env.RECIPIENT_EMAIL || ''],
            subject: `CodePair Feedback from ${name} - ${category}`,
            text: `${name} (${email}) submitted the following feedback in the category "${category}":\n\n${message}`,
        })
    } catch (error) {
        console.error('Error sending email:', error)
    }
}

export { sendEmail }