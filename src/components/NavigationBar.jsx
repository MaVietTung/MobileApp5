import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setInput, setLanguage, setSortedBy, setWhichMovies } from "../redux/features/navigationBar/navigationBarSlice"
import { getSearchAndQuery } from "../redux/features/searchAndQuery/searchAndQuerySlice"
import logo from "../assets/images/logo.png"

import { Navbar, Nav, NavDropdown, Form, Button } from "react-bootstrap"

import "../styles/NavigationBar.css"

import * as Functions from "../localStorage/localStorage"

function NavigationBar() {

    const location = useLocation()
    const navigate = useNavigate()
    const currentLocation = location.pathname
    const dispatch = useDispatch()

    const [isClicked, setIsClicked] = useState({
        movies: Functions.fetchWhichMovies(),
        sortedBy: Functions.fetchSortedBy(),
        language: Functions.fetchLanguage() || "zh-CN" // Mặc định là tiếng Trung
    })

    const input = useSelector((state) => state.navigationBarReducer.input)
    const language = useSelector((state) => state.navigationBarReducer.language)

    const handleOptionClick = (type, value) => {
        setIsClicked({ ...isClicked, [type]: value })
        switch (type) {
            case "movies":
                dispatch(setWhichMovies(value))
                break;
            case "sortedBy":
                dispatch(setSortedBy(value))
                break;
            case "language":
                dispatch(setLanguage(value))
                break;
            default:
                break;
        }
    };

    const handleInputChange = (e) => {
        dispatch(setInput(e.target.value))
    }

    const navbarBrandClick = () => {
        if (currentLocation === "/") {
            window.scrollTo(0, 0)
        }
        else {
            navigate("/")
        }
    }

    const activeStyle = {
        color: "#DC3545",
        fontWeight: "bold",
    }

    return (
        <Navbar fixed="top" expand="lg" className="bg-dark" data-bs-theme="dark">
            <div className="container">
                <Navbar.Brand onClick={navbarBrandClick} style={{ cursor: "pointer" }}><img src={logo} alt="logo" style={{ width: "30px", height: "30px" }} /></Navbar.Brand>

                {currentLocation === "/" && (
                    <>
                        <Navbar.Toggle />
                        <Navbar.Collapse>
                            <Nav className="me-auto my-2 my-lg-0">
                                {input == "" &&
                                    <>
                                        <NavDropdown title={language === "zh-CN" ? "电影列表" : "电影列表"}>
                                            <NavDropdown.Item className='dropdown-item' onClick={() => handleOptionClick('movies', 'top_rated')} style={isClicked.movies === "top_rated" ? activeStyle : {}}>{language === "zh-CN" ? "最高评分" : "最高评分"}</NavDropdown.Item>
                                            <NavDropdown.Item className='dropdown-item' onClick={() => handleOptionClick('movies', 'popular')} style={isClicked.movies === "popular" ? activeStyle : {}}>{language === "zh-CN" ? "受欢迎" : "受欢迎"}</NavDropdown.Item>
                                            <NavDropdown.Item className='dropdown-item' onClick={() => handleOptionClick('movies', 'upcoming')} style={isClicked.movies === "upcoming" ? activeStyle : {}}>{language === "zh-CN" ? "即将上映" : "即将上映"}</NavDropdown.Item>
                                            <NavDropdown.Item className='dropdown-item' onClick={() => handleOptionClick('movies', 'now_playing')} style={isClicked.movies === "now_playing" ? activeStyle : {}}>{language === "zh-CN" ? "正在播放" : "正在播放"}</NavDropdown.Item>
                                        </NavDropdown>

                                        <NavDropdown title={language === "zh-CN" ? "按IMDb评分排序" : "按IMDb评分排序"}>
                                            <NavDropdown.Item className='dropdown-item' onClick={() => handleOptionClick('sortedBy', 'default')} style={isClicked.sortedBy === "default" ? activeStyle : {}}>{language === "zh-CN" ? "默认" : "默认"}</NavDropdown.Item>
                                            <NavDropdown.Item className='dropdown-item' onClick={() => handleOptionClick('sortedBy', 'descending')} style={isClicked.sortedBy === "descending" ? activeStyle : {}}>{language === "zh-CN" ? "降序" : "降序"}</NavDropdown.Item>
                                            <NavDropdown.Item className='dropdown-item' onClick={() => handleOptionClick('sortedBy', 'ascending')} style={isClicked.sortedBy === "ascending" ? activeStyle : {}}>{language === "zh-CN" ? "升序" : "升序"}</NavDropdown.Item>
                                        </NavDropdown>

                                        <NavDropdown title={language === "zh-CN" ? "语言" : "语言"}>
                                            <NavDropdown.Item className='dropdown-item' onClick={() => handleOptionClick('language', 'zh-CN')} style={isClicked.language === "zh-CN" ? activeStyle : {}}>{language === "zh-CN" ? "Chinese (zh-CN)" : "Chinese (zh-CN)"}</NavDropdown.Item>
                                        </NavDropdown>
                                    </>
                                }
                            </Nav>
                            <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                                <Form.Control
                                    type="search"
                                    placeholder={language === "zh-CN" ? "搜索电影" : "搜索电影"}
                                    className="input me-1"
                                    aria-label="Search"
                                    onChange={handleInputChange}
                                    value={input}
                                    spellCheck="false"
                                />
                                <Button className="btn btn-danger text-white" type="submit" onClick={() => dispatch(getSearchAndQuery(input))}>{language === "zh-CN" ? "搜索" : "搜索"}</Button>
                            </Form>
                        </Navbar.Collapse>
                    </>
                )}

            </div>
        </Navbar>
    );
}

export default NavigationBar


