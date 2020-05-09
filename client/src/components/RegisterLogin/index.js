import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginUser } from  '../../actions/user_actions'
import { Link } from 'react-router-dom';

class RegisterLogin extends Component {
    state = {
        email: "",
        password: "",
        errors: []
    };

    displayErrors = errors => 
        errors.map((error, i) => <p key={i}> {error}</p>);

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    submitForm = event => {
        event.preventDefault();
        let dataToSubmit = {
            email: this.state.email,
            password: this.state.password,
        }

        // empty array of errors if valid
        if(this.isFormValid(this.state)) {
            this.setState({ errors: [] })
            this.props.dispatch(loginUser(dataToSubmit)).then(response => {
                // go to homepage if login is successful
                if (response.payload.loginSuccess) {
                    this.props.history.push('/')
                }
                else {
                    this.setState({
                        errors: this.state.errors.concat(
                            "Failed to log in. Please check your email and password."
                            )
                    })
                }
            })
            
        }
        else {
            this.setState({
                errors: this.state.errors.concat("Please fill in the required information.")
            })
        }

    }

    isFormValid = ({email, password}) => email && password;

    render() {
        return (
            <div className="container">
                <h3> Login </h3>
                <div className="row">
                    <form className="col s10" onSubmit={this.submitForm}>
                        <div className="row">
                            <div className="input-field col s10">
                                <input 
                                    name="email"
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                    id="email"
                                    type="email"
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
                            <span
                                className="helper-test"
                                data-error="Invalid password"
                                data-success="Success"
                                />
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
                                    Login
                                </button>&nbsp; &nbsp;
                                <Link to="/register">
                                    <button 
                                    className="btn waves-effect purple lighten-2"
                                    type="submit"
                                    name="action"
                                    >
                                        Sign up
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(RegisterLogin);