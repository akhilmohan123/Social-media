import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBRow,
  MDBInput,
} from "mdb-react-ui-kit";
import { useSelector } from "react-redux";

function Editprofile() {
  const [value, Setvalue] = useState({ Fname: "", Lname: "", Image: null });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const profiledata = useSelector((state) => state.User.profileData);
  // useEffect(()=>{
  //     try {
  //         axios.get("http://localhost:3001/edit-profile",{
  //             headers:{
  //                 Authorization:`Bearer ${token}`
  //             }
  //         }).then(data=>{
  //             Setvalue({
  //                 Fname:data.data.Fname||"",
  //                 Lname:data.data.Lname||"",
  //                 Image:data.data.Image||""
  //             })
  //         })
  //     } catch (error) {

  //     }
  // },[token])

  useEffect(() => {
    Setvalue({
      Fname: profiledata?.Fname || "",
      Lname: profiledata?.Lname || "",
      Image: profiledata?.image || null,
    });
  }, [profiledata]);
  function handlechange(e) {
    const { name, value } = e.target;
    Setvalue((prevalue) => ({ ...prevalue, [name]: value }));
  }
  function handleimage(e) {
    const image = e.target.files[0];
    Setvalue((prevvalue) => ({
      ...prevvalue,
      Image: image,
    }));
  }
  function handlesubmit(e) {
    e.preventDefault();
    const form = new FormData();
    form.append("Fname", value.Fname);
    form.append("Lname", value.Lname);
    form.append("profilePic", value.Image);
    console.log(form);
    try {
      axios
        .post("http://localhost:3001/edit-profile", form, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((result) => {
          navigate("/profile");
        });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <MDBContainer fluid>
        <div
          className="p-5 bg-image"
          style={{
            backgroundImage:
              "url(https://mdbootstrap.com/img/new/textures/full/171.jpg)",
            height: "300px",
          }}
        ></div>

        <MDBCard
          className="mx-5 mb-5 p-5 shadow-5"
          style={{
            marginTop: "-100px",
            background: "hsla(0, 0%, 100%, 0.8)",
            backdropFilter: "blur(30px)",
          }}
        >
          <MDBCardBody className="p-5 text-center">
            <h2 className="fw-bold mb-5">Edit Profile</h2>
            {value ? (
              <MDBRow>
                <MDBCol col="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="First name"
                    id="form1"
                    type="text"
                    name="Fname"
                    value={value.Fname}
                    onChange={handlechange}
                  />
                </MDBCol>

                <MDBCol col="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Last name"
                    id="form1"
                    type="text"
                    name="Lname"
                    value={value.Lname}
                    onChange={handlechange}
                  />
                </MDBCol>
                <MDBCol col="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Image "
                    id="form1"
                    type="file"
                    name="image"
                    onChange={handleimage}
                  />
                </MDBCol>
              </MDBRow>
            ) : (
              <MDBRow>
                <MDBCol col="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="First name"
                    id="form1"
                    type="text"
                  />
                </MDBCol>

                <MDBCol col="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Last name"
                    id="form1"
                    type="text"
                  />
                </MDBCol>
                <MDBCol col="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Image "
                    id="form1"
                    type="file"
                  />
                </MDBCol>
              </MDBRow>
            )}

            <MDBBtn className="w-100 mb-4" size="md" onClick={handlesubmit}>
              Submit
            </MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
}

export default Editprofile;
