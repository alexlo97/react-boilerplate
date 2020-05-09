import React, { Component } from 'react';
import { connect } from 'react-redux';
import { registerUser } from  '../../actions/user_actions';

class Register extends Component {
    state = {
        name: "",
        lastname: "",
        email: "",
        password: "",
        passwordConfirm: "",
        errors: []
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    displayErrors = errors => 
    errors.map((error, i) => <p key={i}> {error} </p>);

    isFormEmpty = ({name, lastname, email, password, passwordConfirm}) => {
        // if any information is not filled out, return true
        if(
            !name.length || 
            !lastname.length ||
            !email.length ||
            !password.length ||
            !passwordConfirm.length 
            ) {
                return true;
            }
        else {
            return false;
        }
    }

    isPasswordValid = ({password, passwordConfirm}) => {
        if(password.length < 6 || passwordConfirm.length < 6) {
            return false;
        }
        else if (password !== passwordConfirm) {
            return false;
        }
        else {
            return true;
        }
    }

    isFormValid = () => {
        let errors = [];
        let error;
        if(this.isFormEmpty(this.state)) {
            error = {
                message: "Please fill in all fields"
            };
            this.setState({
                errors: errors.concat(error)
            });
        }
        else if (!this.isPasswordValid(this.state)) {
            error = { message: "Password is invalid"};
            this.setState({ errors: errors.concat(error)})
        }
        else {
            return true;
        }
    }

    submitForm = event => {
        event.preventDefault();
        //get data from state
        let dataToSubmit =  {
            email: this.state.email,
            name: this.state.name,
            lastname: this.state.lastname,
            password: this.state.password,
            passwordConfirm: this.state.passwordConfirm
        }

        if(this.isFormValid()) {
            this.setState({errors: []});
            this.props.dispatch(registerUser(dataToSubmit))
            .then(response => {
                if(response.payload.success) {
                    // return to login page
                    this.props.history.push('/login')
                }
                else {
                    this.setState({
                        errors: this.state.errors.concat(
                            "Your attempt to send data to database was unsuccessful"
                            )
                    })
                }
            })
            .catch(err => {
                this.setState({
                    errors: this.state.errors.concat(err)
                });
            })
        }
        else {
            console.error("Form is invalid")
        }
    }
    render() {
        return (
            <div className="container">
            <h3> Sign Up </h3>
            <div className="row">
                <form className="col s10" onSubmit={this.submitForm}>
                    <div className="row">
                        <div className="input-field col s10">
                            <input 
                                name="name"
                                value={this.state.name}
                                onChange={this.handleChange}
                                id="name"
                                type="text"
                                className="validate"
                            />
                            <label className="active" htmlFor="name">
                                First name
                            </label>
                            <span
                                className="helper-test"
                                data-error="Invalid email"
                                data-success="Success"
                                />
                        </div>
                    </div>

                    <div className="row">
                        <div className="input-field col s10">
                        <input 
                            name="lastname"
                            value={this.state.lastname}
                            onChange={this.handleChange}
                            id="lastname"
                            type="text"
                            className="validate"
                        />
                        <label className="active" htmlFor="lastname">
                            Last name
                        </label>
                        <span
                            className="helper-test"
                            data-error="Invalid password"
                            data-success="Success"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="input-field col s10">
                        <input 
                            name="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            id="email"
                            type="text"
                            className="validate"
                        />
                        <label className="active" htmlFor="email">
                            Email
                        </label>
                        <span
                            className="helper-test"
                            data-error="Invalid email"
                            data-success="Success"
                            />
                        </div>
                    </div>

                    <div className="row">
                            <div className="input-field col s10">
                            <input 
                                name="password"
                                value={this.state.password}
                                onChange={this.handleChange}
                                id="password"
                                type="password"
                                className="validate"
                            />
                            <label className="active" htmlFor="password">
                                Password
                            </label>
                            </div>
                    </div>

                    <div className="row">
                            <div className="input-field col s10">
                            <input 
                                name="passwordConfirm"
                                value={this.state.passwordConfirm}
                                onChange={this.handleChange}
                                id="passwordConfirm"
                                type="password"
                                className="validate"
                            />
                            <label className="active" htmlFor="passwordConfirm">
                                Password confirmation
                            </label>
                            </div>
                    </div>

                    {this.state.errors.length > 0 && (
                        <div>
                            {this.displayErrors(this.state.errors)}
                        </div>
                    )}
                    <div className="row">
                        <div className="col s6">
                            <button 
                            className="btn waves-effect purple lighten-2"
                            type="submit"
                            name="action"
                            onClick={this.submitForm}
                            >
                                Create account
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        );
    }
}

export default connect()(Register);
