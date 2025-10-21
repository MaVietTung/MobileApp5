import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setInput, setLanguage, setSortedBy, setWhichMovies } from "../redux/features/navigationBar/navigationBarSlice";
import { getSearchAndQuery } from "../redux/features/searchAndQuery/searchAndQuerySlice";
import logo from "../assets/images/logo.png";

import { Navbar, Nav, NavDropdown, Form, Button } from "react-bootstrap";

import "../styles/NavigationBar.css";

import * as Functions from "../localStorage/localStorage";

function NavigationBar() {

    const location = useLocation();
    const navigate = useNavigate();
    const currentLocation = location.pathname;
    const dispatch = useDispatch();

    // CHỈNH SỬA 1: Thay đổi ngôn ngữ mặc định trong state của component
    const [isClicked, setIsClicked] = useState({
        movies: Functions.fetchWhichMovies(),
        sortedBy: Functions.fetchSortedBy(),
        language: "th-TH" // Đổi từ "en-US" sang "th-TH" (Tiếng Thái)
    });

    const input = useSelector((state) => state.navigationBarReducer.input);

    // Lưu ý: Dòng code này lấy state từ Redux, nhưng nó không
    // được dùng để khởi tạo 'isClicked.language'. 
    // Rất có thể bạn cũng cần thay đổi initialState trong 
    // file navigationBarSlice.js (Redux) để state mặc định là "th-TH".
    const language = useSelector((state) => state.navigationBarReducer.language);

    const handleOptionClick = (type, value) => {
        setIsClicked({ ...isClicked, [type]: value });
        switch (type) {
            case "movies":
                dispatch(setWhichMovies(value));
                break;
            case "sortedBy":
                dispatch(setSortedBy(value));
                break;
            case "language":
                dispatch(setLanguage(value));
                break;
            default:
                break;
        }
    };

    const handleInputChange = (e) => {
        dispatch(setInput(e.target.value));
    }

    const navbarBrandClick = () => {
        if (currentLocation === "/") {
            window.scrollTo(0, 0);
        } else {
            navigate("/");
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
                                {input === "" &&
                                    <>
                                        <NavDropdown title="Movies">
                                            <NavDropdown.Item className='dropdown-item' onClick={() => handleOptionClick('movies', 'top_rated')} style={isClicked.movies === "top_rated" ? activeStyle : {}}>Top Rated</NavDropdown.Item>
                                            <NavDropdown.Item className='dropdown-item' onClick={() => handleOptionClick('movies', 'popular')} style={isClicked.movies === "popular" ? activeStyle : {}}>Popular</NavDropdown.Item>
                                            <NavDropdown.Item className='dropdown-item' onClick={() => handleOptionClick('movies', 'upcoming')} style={isClicked.movies === "upcoming" ? activeStyle : {}}>Upcoming</NavDropdown.Item>
                                            <NavDropdown.Item className='dropdown-item' onClick={() => handleOptionClick('movies', 'now_playing')} style={isClicked.movies === "now_playing" ? activeStyle : {}}>Now Playing</NavDropdown.Item>
                                        </NavDropdown>

                                        <NavDropdown title="Sort By">
                                            <NavDropdown.Item className='dropdown-item' onClick={() => handleOptionClick('sortedBy', 'default')} style={isClicked.sortedBy === "default" ? activeStyle : {}}>Default</NavDropdown.Item>
                                            <NavDropdown.Item className='dropdown-item' onClick={() => handleOptionClick('sortedBy', 'descending')} style={isClicked.sortedBy === "descending" ? activeStyle : {}}>Descending</NavDropdown.Item>
                                            <NavDropdown.Item className='dropdown-item' onClick={() => handleOptionClick('sortedBy', 'ascending')} style={isClicked.sortedBy === "ascending" ? activeStyle : {}}>Ascending</NavDropdown.Item>
                                        </NavDropdown>

                                        {/* CHỈNH SỬA 2: Thêm Tiếng Thái vào danh sách dropdown */}
                                        <NavDropdown title="Language">
                                            <NavDropdown.Item className='dropdown-item' onClick={() => handleOptionClick('language', 'th-TH')} style={isClicked.language === "th-TH" ? activeStyle : {}}>Thai (th-TH)</NavDropdown.Item>
                                            <NavDropdown.Item className='dropdown-item' onClick={() => handleOptionClick('language', 'en-US')} style={isClicked.language === "en-US" ? activeStyle : {}}>English (en-US)</NavDropdown.Item>
                                            <NavDropdown.Item className='dropdown-item' onClick={() => handleOptionClick('language', 'zh-CN')} style={isClicked.language === "zh-CN" ? activeStyle : {}}>Chinese (zh-CN)</NavDropdown.Item>
                                        </NavDropdown>
                                    </>
                                }
                            </Nav>
                            <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                                <Form.Control
                                    type="search"
                                    placeholder="Search for movies..."
                                    className="input me-1"
                                    aria-label="Search"
                                    onChange={handleInputChange}
                                    value={input}
                                    spellCheck="false"
                                />
                                <Button className="btn btn-danger text-white" type="submit" onClick={() => dispatch(getSearchAndQuery(input))}>Search</Button>
                            </Form>
                        </Navbar.Collapse>
                    </>
                )}

            </div>
        </Navbar>
    );
}

export default NavigationBar;

