import { useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../config/axiosInstance";
import { isEmail } from "../helper/regexMatcher";
import HomeLayout from "../layouts/Layout"



const Contact =  () => {


    const [contactDetails, setContactDetails] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setContactDetails({...contactDetails, [name]: value});
    }

    const onFormSubmit = async (e)=>{
        e.preventDefault();
        if(!contactDetails.name || !contactDetails.email || !contactDetails.message){
            toast.error("Please fill all the fields in contact form");
            return;
        }

        if(!isEmail(contactDetails.email)){
            toast.error("Enter a Valid Email");
            return;
        }

        // sending email to backend and then to mailtrap
        try {
            const responsePromise = axiosInstance.post("/contact",contactDetails);
            console.log(responsePromise);
            toast.promise(responsePromise,{
                loading: "Sending Mail...",
                success: (res) => {
                    return res.data?.message || "Mail Sent Successfully "
                },
                error: (err) => {
                    return console.log(err || "Unable to send Mail")
                }
            })

            // setContactDetails({
            //     name: "",
            //     email: "",
            //     message: "",
            // });

            const response = await responsePromise;
            return response;

        } catch (error) {
            return toast.error(error?.response?.data?.message || "Unable to send Mail")
        }
    }

  return (
    <HomeLayout>
        <div className="flex items-center justify-center h-[100vh]">
            <form noValidate className="flex flex-col justify-center items-center gap-2 p-5 w-[22rem] rounded-md text-white">
                <img src="https://avatars.githubusercontent.com/u/115637298?v=4" alt="Creator's Avatar" className="w-24 h-24 rounded-full mb-4" />
                <h1 className="font-semibold text-3xl mb-4">Contact Us</h1>

                <input type="text" 
                name="name"
                value={contactDetails.name}
                onChange={handleChange}
                autoComplete="name"
                placeholder="Name" 
                className="p-2 w-full rounded-md outline-none border-2 border-gray-200 focus:border-blue-500 transition-colors" />

                <input type="email" 
                name="email"
                value={contactDetails.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="Email" 
                className="p-2 w-full rounded-md outline-none border-2 border-gray-200 focus:border-blue-500 transition-colors" />

                <textarea 
                name="message"
                value={contactDetails.message}
                onChange={handleChange}
                autoComplete = "off"
                placeholder="Message" 
                className="p-2 w-full h-32 rounded-md outline-none border-2 border-gray-200 focus:border-blue-500 transition-colors" />

                <button type="submit" 
                onClick={onFormSubmit}
                className="p-2 w-full rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors">Submit</button>
            </form>
        </div>
    </HomeLayout>
    )
}

export default Contact