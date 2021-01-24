// import React, { useEffect, useState } from "react";
// import {
//   CircularProgress,
//   Typography,
//   Box,
//   FormControl,
//   InputLabel,
//   InputAdornment,
//   IconButton,
//   TextField,
//   Input,
//   Paper,
// } from "@material-ui/core";
// import { makeStyles, useTheme } from "@material-ui/core/styles";
// import ActionTypes from "../../constants/ActionTypes";
// import hostsStore from "../../store/Hosts";
// import HostsApi from "../../api/Hosts";

// const useStyles = makeStyles((theme) => ({
//   table: {
//     minWidth: 500,
//   },
//   loadingContainer: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: theme.spacing(3),
//   },
// }));

// const HostPatternInputComponent = ({ hostName }) => {
//   const [IsLoadingHost, setIsLoadingHost] = useState(true);
//   const [Host, setHost] = useState(hostsStore.getByName(hostName));
//   const classes = useStyles();
//   const isLoading = !Host;
//   const theme = useTheme();

//   const onHostSync = ({ host }) => {
//     if (host === hostName) {
//       setHost(host);
//     }
//   };

//   useEffect(async () => {
//     const host = await HostsApi.getByName(hostName);
//     setHost(host);
//   }, [hostName]);

//   return (
//     <Paper
//       variant="outlined"
//       style={{
//         margin: theme.spacing(2),
//         marginTop: theme.spacing(1),
//         padding: theme.spacing(2),
//       }}
//     >
//       {isLoading ? (
//         <div className={classes.loadingContainer}>
//           <CircularProgress />
//         </div>
//       ) : (
//         <Box display="flex" justifyContent="start" flexDirection="column">
//           <Typography variant="h6">
//             <code>{hostName}</code> seems to be a portal we have never scraped
//           </Typography>
//           <Typography variant="subtitle1">
//             Please help us understand how do job links look like by inputting a
//             pattern in the textfield below.
//           </Typography>

//           <FormControl>
//             <InputLabel htmlFor="add-variable-input">Password</InputLabel>
//             <Input
//               id="add-variable-input"
//               type={values.showPassword ? "text" : "password"}
//               value={values.password}
//               //   onChange={handleChange("password")}
//               endAdornment={
//                 <InputAdornment position="end">
//                   <IconButton
//                     aria-label="toggle password visibility"
//                     onClick={handleClickShowPassword}
//                     onMouseDown={handleMouseDownPassword}
//                   ></IconButton>
//                 </InputAdornment>
//               }
//             />
//           </FormControl>
//         </Box>
//       )}
//     </Paper>
//   );
// };

// export default HostPatternInputComponent;
