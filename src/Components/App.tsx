import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, Tab, Tabs, TextField} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import QRCode from 'qrcode.react'
import { HexColorPicker } from "react-colorful";
//@ts-ignore
import qrlogo from '../assets/qrlogo.png'
//@ts-ignore
import reactLogo from '../assets/react-js.svg'
//@ts-ignore
import scan from '../assets/qrScan.png'

import { Info } from './Info';
import parsePhoneNumberFromString from 'libphonenumber-js';


type dataType = {
    code: string
}



export const App = () => {
    const qrRef = React.useRef();
    const [url, setUrl] = useState('Look who it is!')
    const [value, setValue] = useState(0);
    const [fgColor, setFgColor] = useState("#000000");
    const [activeFgColor, setActiveFgColor] = useState(false)
    const [activeLogo, setActiveLogo] = useState(false)
    
    const handleChange = (e: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        console.log(newValue)
    };


    const downloadQRCode = (evt: React.FormEvent) => {
        evt.preventDefault();
        // @ts-ignore
        let canvas = qrRef.current.querySelector("canvas");
        let image = canvas.toDataURL("image/png");
        let anchor = document.createElement("a");
        anchor.href = image;
        anchor.download = `qr-code.png`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        setUrl("");
      };
    const qrCode = (
        <QRCode
          id="qrCodeElToRender"
          size={290}
          value={url}
          bgColor="white"
          fgColor={fgColor}
          level="H"
          imageSettings={activeLogo && {
            src: scan,
            excavate: true,
            width: 800 * 0.1,
            height: 800 * 0.1,
          }}
        />
      );

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
                {value === 0 && <LinkComponent setUrl={setUrl}/>} 
                {value === 1 && <TextComponent setUrl={setUrl}/>} 
                {value === 2 && <PhoneComponent setUrl={setUrl}/>} 
                
                </div>
                <div className='mine'>
                    <div className="qr-container__qr-code" ref={qrRef}>
                        {qrCode}
                    </div>
                    <div className="mine__qr-buttons">
                        <Button variant="contained" size="small" onClick={() => setActiveFgColor(prev => !prev)}>Edit Color</Button>
                        <div className="mine__qr-download">
                            <a href={url} download> 
                                <Button className="mine__download" color="primary" startIcon={<SaveIcon />} variant="contained" size="medium" onClick={downloadQRCode}> 
                                    Save 
                                </Button>
                            </a>
                        </div>
                        <Button variant="contained" size="small" onClick={() => setActiveLogo(prev => !prev)}>Add Logo</Button>
                    </div>
                    {activeFgColor && <HexColorPicker className="mine__colors" color={fgColor} onChange={setFgColor} />}            
                </div>
            </div>
           <Info />
        </div>
    </div>
}

export const LinkComponent = ({setUrl}) => {
    const { register, handleSubmit } = useForm();
    const onSubmit: SubmitHandler<dataType> = (data) => {
        const text = data.code
        setUrl(text) 
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

export const TextComponent = ({setUrl}) => {
    const { register, handleSubmit } = useForm();
    const onSubmit: SubmitHandler<dataType> = (data) => {
        const text = data.code
        setUrl(text) 
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
export const PhoneComponent = ({setUrl}) => {
    const { register, handleSubmit } = useForm();
    const onSubmit: SubmitHandler<dataType> = (data) => {
        const text = data.code
        setUrl(text) 
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
  


