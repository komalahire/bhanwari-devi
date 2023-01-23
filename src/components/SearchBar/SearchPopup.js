import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { actions as courseActions } from "../Course/redux/action";
import { actions as pathwayActions } from "../PathwayCourse/redux/action";
import { breakpoints } from "../../theme/constant";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";
import { PATHS, interpolatePath } from "../../constant";
import { useSearchQuery } from "../../common/search";
import {
  Box,
  TextField,
  Container,
  Typography,
  Grid,
  Card,
  Button,
  Tooltip,
  Popper,
} from "@mui/material";
import useStyles from "./styles";
import { Popover, InputAdornment } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SearchCourse from ".";
import it from "date-fns/esm/locale/it/index.js";

function SearchPopup() {
  const { data } = useSelector(({ Course }) => Course);
  const pathway = useSelector((state) => state.Pathways);
  const dispatch = useDispatch();
  // const [recentSearch,setrecentSearch]=useState("")
  const [search, setSearch] = useState("");
  const [focus, setFocus] = useState(true);
  useSearchQuery(setSearch);
  const history = useHistory();
  const classes = useStyles();
  const isActive = useMediaQuery("(max-width:" + breakpoints.values.sm + "px)");
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const handleSearchChange = (e) => {
    if (!e.target.value) {
      history.replace("");
    } else {
      history.replace(`/search-course/?search=${e.target.value}`);
    }
    e.preventDefault();
    setSearch(e.target.value);
  };

  const handleSearchBar = (e) => {
    if (!e.target.value) {
      history.replace("");
    } else {
      history.replace(`/search-course/?search=${e.target.value}`);
    }
    setSearch(e.target.value);
  };

  const [close, setClose] = "";
  const handleSearchClose = (e) => {
    setClose(search);
  };
  const pathwayCourseIds =
    pathway.data?.pathways
      .map((pathway) => pathway.courses || [])
      .flat()
      .map((course) => course.id) || [];
  const otherCourseResults = data?.allCourses.filter((item) => {
    return (
      // item.course_type === "json" &&
      !pathwayCourseIds.includes(item.id) &&
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  });
  const pathwayTrackResults = pathway.data?.pathways
    .map((pathway) => {
      return {
        ...pathway,
        courses: pathway.courses?.filter((course) => {
          return course.name.toLowerCase().includes(search.toLowerCase());
        }),
      };
    })
    .filter((pathway) => pathway.courses?.length > 0);

  const rojgar = pathwayTrackResults?.map((item) => {
    return item.courses?.length;
  });

  let sum = rojgar?.reduce((total, item) => {
    return total + item;
  }, 0);

  // const countData=rojgar.map((index))
  // const [count,setCount]=useState(0)
  // useState(()=>{

  //   setCount(
  //     count++rojgar
  //   )
  // },[rojgar])

  // useEffect(()=>{
  //   if(search){

  //     setCount()
  //   }
  // })
  // console.log(count)
  const hasSearchResults =
    pathwayTrackResults?.length > 0 || otherCourseResults?.length > 0;

  // console.log(pathway.data && pathway.data.pathways)
  const handleClose = () => {
    setAnchorEl(null);
  };
  const recent = JSON.parse(localStorage.getItem("recent"));

  return (
    <>
      <Button onClick={handleClick} color="dark">
        <SearchOutlinedIcon aria-describedby={id} />
      </Button>

      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        fullWidth
        onClose={handleClose}
        maxWidth={false}
        sx={{
          minWidth: 0,
          maxWidth: "calc(100vw - 0px) !important",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box
          sx={{
            p: 1,
            width: isActive ? "375px" : "1330px",
            bgcolor: "background.paper",
            marginTop: "16px",
          }}
        >
          <Container maxWidth="lg">
            <TextField
              id="standard-search"
              placeholder="Search Course"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ margin: "40px 0px 32px 0px" }}
              inputRef={(input) => {
                if (input != null) {
                  input.focus();
                }
              }}
              variant="standard"
              fullWidth
              value={search}
              onChange={handleSearchChange}
              onClose={handleSearchClose}
            />

            {search ? (
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "600",
                  fontSize: "18px",
                  marginBottom: "16px",
                }}
              >
                {sum} result found
              </Typography>
            ) : (
              <>
                <Typography variant="subtitle1">Recent Search</Typography>

                <Grid container sx={{ mt: "16px", mb: "32px" }}>
                  {recent.slice(Math.max(recent.length - 5, 1)).map((item) => (
                    <Grid item mr={2}>
                      <Button value={item} onClick={handleSearchBar}>
                        {item}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Container>
        </Box>
      </Popper>
    </>
  );
}
export default SearchPopup;
