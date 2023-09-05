import React, { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AxiosService from "../AxiosService"
import SideBar from "../components/SideBar"

const SettingsPage = () => {
    const navigate = useNavigate()

    const [shrink, setShrink] = useState(false)
    const [accountDelete, setAccoutnDelete] = useState(false)
    const [pwd, setPwd] = useState("")
    const [errorMsg, setError] = useState("")
    const [buttonDisabled,setButtonDisabled] = useState(false)

    const deleteAll = async() => {
        setAccoutnDelete(true)
        if(accountDelete) {
            setButtonDisabled(true)
            setTimeout(() => setButtonDisabled(false),1200)

            AxiosService.wipeUser(pwd).then((response) => {
                if (response.status == 200) {
                    AxiosService.logout().then((response) => {
                        if (response == "token deleted") navigate("/")
                    })
                } else {
                    setError(response.data.error)
                }
            })
        }
    }
    return (
        <section className="AboutPage">
            <SideBar shrink={shrink} setShrink={setShrink}></SideBar>
            <section className={shrink ? `shrink` : `Page`}>
                <div className="topbar">
                    <h1> More options</h1>
                </div>

                <section className="maincontent">
                    <div className="wipeAccountsection">
                        <button
                                className="deleteAllBtn" 
                                disabled={buttonDisabled}
                            onClick={() => deleteAll()}
                        >
                            {" "}
                            Delete all account data
                        </button>
                        <p> Warning! This cannot be undone!</p>
                        {accountDelete ? (
                            <form onSubmit={(event) => event.preventDefault()}>
                                <label> Enter password </label>
                                <input
                                    type="password"
                                    placeholder="*****"
                                    name="password"
                                    value={pwd}
                                    onChange={(e) => {
                                        setPwd(e.target.value)
                                    }}
                                    required
                                />
                                {errorMsg != "" && (
                                    <p className="errorText"> {errorMsg}</p>
                                )}
                            </form>
                        ) : (
                            <span />
                        )}
                    </div>
                </section>
            </section>
        </section>
    )
}
export default SettingsPage
