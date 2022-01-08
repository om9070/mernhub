import React, { useState } from 'react';

const Fristpage = () => {
    const [count, setcount] = useState({ h: 144, m: 0, s: 0 });// user for timer
    const [min, setmin] = useState(100);//relate gross data
    const [sec, setsec] = useState(1100);//relate net data
    const [hor, sethor] = useState(2100);//relate gross data
    const [data, setdata] = useState({ name: "", user: "" })//this use for input data
    const [gt, setgt] = useState([]);//user for get methode to store data


    //144hr timer setup
    function Timer() {
        if (count.h === 0 && count.m === 0 && count.s === 0) {
            count.h = 0;
            count.m = 0;
            count.s = 0;
        } else if (count.s !== 0) {
            count.s--;
        } else if (count.m !== 0 && count.s === 0) {
            count.s = 59;
            count.m--;
        } else if (count.h !== 0 && count.m === 0) {
            count.m = 60;
            count.h--;
        }

        return setcount({ h: count.h, m: count.m, s: count.s });
    }

    function starttime() {
        setInterval(() => {
            Timer() ///call function timer
        }, 1000);
    }


    //this is get methode to show data on screen
    const basedmode = async () => {
        const tiger = await fetch("/boomdata", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const group = await tiger.json();
        setgt(group);
        console.log("database data", group);
        console.log(gt)

    }



    ///this is put mathod to store data in database and update when you clicked
    const leadbutton = async (e) => {
        e.preventDefault();
        setsec(sec + min)
        sethor(hor + sec + min)

        console.log(sec, hor)

        const puredata = await fetch("/process", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ hor, sec })
        })

        const realdata = await puredata.json();
        console.log(realdata);
        if (puredata.status === 401) {
            window.alert("time up you can't click")
        }
        else {
            console.log("ok")
            basedmode(); //then you click (lead+100) then get methode run and show on screen
        }



    }

    //setup crendentails data
    const fristdata = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setdata({ ...data, [name]: value })
    }


    //this is post methode to backed to store data in database
    const finalset = async (e) => {
        e.preventDefault();
        const { name, user } = data
        console.log(name, user)

        const org = await fetch("/regvalue", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, user })
        })

        const getdata = await org.json();
        console.log("this data", getdata);
        if (org.status === 201) {
            window.alert("data is submit succes");
            starttime();//this time is not workin then you log in succesfully then your timer will start
            // 144hr

        } else if (org.status === 422) {
            window.alert("invalid details")//if you input empty data then alert this message
        } else {
            console.log("some thing error")
        }
        setdata({ name: "", user: "" })//this is user remove data from input box
    }
    return (
        <>
            <div className=' container' >
                <div className='row'>

                    <div className=' col-md-6 col-12 my-2 text-center'>
                        <h3 className='my-3'>enter the credentials</h3>
                        <form method='POST'>

                            <div className="col-md-8 col-8 my-2 mx-auto">
                                <input type="text" className="form-control" onChange={fristdata} name='name' value={data.name} id="exampleFormControlInput1" placeholder="enter your name" />
                            </div>
                            <div className="col-md-8 col-8 my-2 mx-auto">
                                <input type="text" className="form-control" onChange={fristdata} name='user' value={data.user} id="exampleFormControlInput1" placeholder="input your userid" />
                            </div>
                            <button type="submit" class="btn btn-secondary" onClick={finalset}>submit</button>
                        </form>
                    </div>
                    <div className=' col-md-6 col-12 my-3'>
                        <div>
                            <div className='card col-md-6 col-6 mx-auto d-flex flex-row'>
                                <div className=' col-md-6 col-6 d-flex'>
                                    <div className=''>
                                        <img src="./profile.jpg" alt="..." className='w-75 profile my-1' />
                                    </div>
                                    <div className=''>
                                        <h5 className='parada'>om_prakash</h5>
                                        <p className='parag'>6 jun,2021</p>
                                    </div>
                                </div>
                                <div className=' col-md-6 col-6 text-center'>
                                    <div>

                                        <h5><span>*</span><span>{gt.length === 0 ? hor : gt.gross}</span></h5>
                                    </div>
                                    <div className=''>
                                        <p className='great'>Gross coins</p>
                                    </div>
                                </div>
                            </div>
                            <div className=' text-center'>
                                <img src="./photo.jpg" className='w-50 mx-auto' alt='...' />
                            </div>
                            <div className='card col-md-6 col-6 mx-auto'>
                                <div className=''>
                                    <div className='row'>
                                        <div className=' col-md-6 col-6 text-center d-flex justify-content-start'>
                                            <span className=' mx-1'>@</span > <span className=' mx-1'>@</span > <span className=' mx-1'>@</span>
                                        </div>
                                        <div className=' col-md-6 col-6 d-flex justify-content-end'>
                                            <button className='lead mx-2 my-1' onClick={leadbutton}>lead+100</button>
                                        </div>
                                    </div>
                                </div>

                                <div className='mx-auto d-flex flex-row'>

                                    <div className=' col-md-6 col-6 d-flex'>
                                        <div className=''>
                                            <img src="./profile.jpg" alt="..." className='w-75 profile my-1' />
                                        </div>
                                        <div className=''>
                                            <h5 className='parada'>{gt.length === 0 ? sec : gt.net}</h5>
                                            <p className='parag'>tommy_baba</p>
                                        </div>
                                    </div>
                                    <div className=' col-md-6 col-6 text-center align-self-center'>
                                        <h5>{count.h < 10 ? "0" + count.h : count.h}:{count.m < 10 ? "0" + count.m : count.m}:{count.s < 10 ? "0" + count.s : count.s}</h5>
                                    </div>
                                </div>

                                <div className='downline'>
                                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet voluptate natus perspiciatis cupiditate obcaecati molestiae!</p>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
export default Fristpage;