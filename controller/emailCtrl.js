
const nodemailer = require("nodemailer");
//const ical = require("ical-generator").default; 
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    service: process.env.EMAIL_SERVICE,
    port: 25,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (data) => {

    /*
     //email_to, email_cc, subject, msg
     const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      htm: resetURL,
    };
    */
    try {       

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: data.to,
            subject: data.subject,
            text: `${data.text}
            ${data.htm}
            Regards, Ecom Team
            `,
        });

        console.log("email sent sucessfully");
        return true;
    } catch (error) {
        console.log(error, "email not sent");
        return false;
    }
};

/*
const sendEvent = async (params) => {
    console.log ('params=',params)
    let appointment=JSON.parse(params);
    console.log ('appointment=',appointment)
    try {
        // Create the iCal event
        const event = ical({
            domain: 'mmvietnam.com',
            prodId: '//MM MEGA MARKET VIETNAM//CalDAV Client//EN'
        });

        // Add event details
        event.createEvent({
            start: new Date(appointment.start),
            end: new Date(appointment.end),
            summary: appointment.subject,
            location: appointment.location,
            description: appointment.description,
            organizer: { name:appointment.organizer_name??appointment.organizer_email,email:appointment.organizer_email},
            attendees: [{ name:appointment.attendee_names, email: appointment.attendee_emails, role: 'REQ-PARTICIPANT' }]
        });

        // Get the iCal content
        const icsContent = event.toString();

        // Send email with attachment
        transporter.sendMail({
            from: appointment.organizer_email,
            to: appointment.attendee_emails,
            cc: process.env.EMAIL_USER??null,
            subject: appointment.subject,
            text: appointment.description,
            attachments: [{ filename: 'calendar.ics', content: icsContent }],
        });

        console.log("Email sent successfully");
        return true;
    } catch (error) {
        console.log("Error sending email:", error);
        return false;
    }
};
*/
module.exports = {sendEmail};