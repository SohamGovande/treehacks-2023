import { createContext, useContext } from "react"

export const DataContext = createContext(null)

export const DataProvider = ({ children, ...rest }) => {
  return <DataContext.Provider value={rest}>{children}</DataContext.Provider>
}

export const useData = () => {
  return useContext(DataContext)
}
