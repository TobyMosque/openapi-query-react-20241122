
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useQuery } from '@tanstack/react-query'
import { Configuration, PetApi } from 'api-client'
import type { FindPetsByStatusStatusEnum } from 'api-client'
import { useState } from 'react'

function App() {
  const config = new Configuration({
    basePath: 'https://petstore.swagger.io/v2',
    fetchApi: window.fetch,
    middleware: [
      {
        async pre(context) {
          return context;
        },
        async post(context) {
          return context.response;
        },
        async onError(context) {
          console.error(context);
          return context.response;
        },
      },
    ],
  })

  const petApi = new PetApi(config)
  const [ status, setStatus ] = useState<FindPetsByStatusStatusEnum[]>([])

  // setStatus(['available'])

  const allStatus: FindPetsByStatusStatusEnum[] = ['available', 'pending', 'sold'] 
  const { data: pets, isLoading } = useQuery({
    queryKey: ['pets', status],
    queryFn: () => petApi.findPetsByStatus({ status: status })
  })

  function toggleStatus(value: FindPetsByStatusStatusEnum) {
    const index = status.indexOf(value)
    const clone = JSON.parse(JSON.stringify(status))
    if (index != -1) {
      clone.splice(index, 1)
      setStatus(clone)
    } else {
      clone.splice(clone.length, 0, value)
      setStatus(clone)
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        {
          allStatus.map(val => (
            <label key={val}>
              <input type="checkbox" checked={status.indexOf(val) !== -1} onChange={() => toggleStatus(val)}></input>
              {val} - {status.some(s => s == val)}
            </label>
          ))
        }
      </div>
      <div className="card">
        <p>isLoading: { isLoading }</p>
        <table>
          <thead>
            <tr>
              <th>id</th>
              <th>category</th>
              <th>name</th>
              <th>tags</th>
              <th>status</th>
            </tr>
          </thead>
          <tbody>
            {pets?.map(pet => (
              <tr>
                <td>{ pet.id }</td>
                <td>{ pet.category?.name }</td>
                <td>{ pet.name }</td>
                <td>{ pet.tags?.map(tag => tag.name).join(', ') }</td>
                <td>{ pet.status }</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
