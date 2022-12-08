import React from 'react'


const CreateUser = ({onChangeForm, createNewUser, loginUser, user, signInWithPhoneNumber }) => {


    return(
        <div className="container">
            <div className="row">
                <div className="col-md-12 mrgnbtm">
                    <h2>Login/Create User</h2>
                <form>
                    <div className="row">
                        <div className="form-group col-md-12">
                            <label htmlFor="exampleInputEmail1">Name</label>
                            <input disabled type="text" onChange={(e) => onChangeForm(e)}  className="form-control" name="firstname" id="firstname" aria-describedby="emailHelp" placeholder="User Name (optional)" />
                        </div>
                        <div className="form-group col-md-12">
                            <label htmlFor="exampleInputEmail1">Email</label>
                            <input type="text" onChange={(e) => onChangeForm(e)} className="form-control" name="email" id="email" autoComplete="current-email" aria-describedby="emailHelp" placeholder="Email" />
                        </div>
                        <div className="form-group col-md-12">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input type="password" onChange={(e) => onChangeForm(e)} className="form-control" name="password" id="password" autoComplete="current-password" placeholder="Password" />
                        </div>
                    </div>
                    <button type="button" onClick= {(e) => createNewUser(e)} className="btn btn-danger">Create New</button>

                    <button id="" type="button" style={{marginLeft:"5px"}} onClick= {(e) => loginUser()} className="btn btn-warning">Login</button>

                    <button id="sign-in-button" type="button" style={{marginLeft:"5px"}} onClick= {(e) => signInWithPhoneNumber()} className="btn btn-warning">Phone Login</button>
                </form>
                </div>
            </div>
        </div>
    )
}

export default CreateUser