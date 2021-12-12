import React, { useEffect, useState } from 'react'
import qrcode from 'qrcode'
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, Tab, Tabs, TextField} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';


//@ts-ignore
import qrlogo from '../assets/qrlogo.png'
//@ts-ignore
import defaultQR from '../assets/default-qr.png'
import { Info } from './Info';
import parsePhoneNumberFromString from 'libphonenumber-js';


type dataType = {
    code: string
}

export const App = () => {
    const [url, srtUrl] = useState('')
    const [$data, $setData] = useState('')
    const [value, setValue] = React.useState(0);

    useEffect(() => {
        if($data.length >= 150) return alert(`You have exceeded the number of characters remove ${$data.length-149} characters`)
        qrcode.toDataURL($data).then((data: string) => srtUrl(data))
    }, [$data])
    
    const handleChange = (e: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        console.log(newValue)
    };
    return <div>
        <div className="header">
            <div className="container">
                <img className="header__logo" src={qrlogo} alt="logo" />
            </div>
        </div>
        <div className="container">
            <div className="body">
                <div className="settings">
                    <Tabs value={value} onChange={handleChange} centered>
                        <Tab label="Link" />
                        <Tab label="Text" />
                        <Tab label="Phone" />
                        {/* <Tab label="Photo" />
                        <Tab label="mp3" />
                        <Tab label="E-mail" />
                        <Tab label="WiFI" />
                        <Tab label="pdf" /> */}
                    </Tabs>
                {value === 0 && <LinkComponent $setData={$setData}/>} 
                {value === 1 && <TextComponent $setData={$setData}/>} 
                {value === 2 && <PhoneComponent $setData={$setData}/>} 
                
                </div>
                <div className='mine'>
                    {
                        //<div><a href={$data}>Перейдти</a></div>
                    }
                    <img className="mine__qr" src={!url ? defaultQR : url} alt="qrcode" />
                    <div className="mine__qr-download"><a href={url} download> <Button color="primary" startIcon={<SaveIcon />} variant="contained"> Save </Button></a></div>
                </div>
            </div>
           <Info />
        </div>
    </div>
}

export const LinkComponent = ({$setData}) => {
    const { register, handleSubmit } = useForm();
    const onSubmit: SubmitHandler<dataType> = (data) => {
        const text = data.code
        $setData(text) 
    }
    return <form className="settings__form" onSubmit={handleSubmit(onSubmit)}>
    <div className="settings__form-cont">
        {
            //max is  242
        }
        <TextField className="settings__form-input" {...register("code")} label="Enter your link" id="outlined-size-small" size="small" />
        <Button className="settings__form-btn" type='submit' variant="contained">Create QR Code</Button>
    </div>
</form>
}

export const TextComponent = ({$setData}) => {
    const { register, handleSubmit } = useForm();
    const onSubmit: SubmitHandler<dataType> = (data) => {
        const text = data.code
        $setData(text) 
    }
    return <form className="settings__form" onSubmit={handleSubmit(onSubmit)}>
    <div className="settings__form-cont">
        {
            //max is  242
        }
        <TextField className="settings__form-input" {...register("code")} id="outlined-textarea" label="Enter your text" multiline />
        <Button className="settings__form-btn" type='submit' variant="contained">Create QR Code</Button>
    </div>
</form>
}

const normalizePhoneNumber = (value) => {
    const phoneNumber = parsePhoneNumberFromString(value)
    if (!phoneNumber)return value
    return phoneNumber.formatInternational()
}
export const PhoneComponent = ({$setData}) => {
    const { register, handleSubmit } = useForm();
    const onSubmit: SubmitHandler<dataType> = (data) => {
        const text = data.code
        $setData(text) 
    }
    return <>
    <form className="settings__form" onSubmit={handleSubmit(onSubmit)}>
    <div className="settings__form-cont">
        <TextField className="settings__form-input" {...register("code")} id="phoneNumber" type="tel" label="Enter your Phone Number" 
        onChange={ (e:any) => e.target.value = normalizePhoneNumber(e.target.value)}/>
        <Button className="settings__form-btn" type='submit' variant="contained">Create QR Code</Button>
    </div>
</form>
</>
}
  


