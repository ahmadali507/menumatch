import AddItemForm from '@/components/forms/add-item'
import { MenuProvider } from '@/context/menuContext'
import React from 'react'

const page = () => {
  return (
    <div>
      <MenuProvider>
          <AddItemForm/>
      </MenuProvider>
    </div>
  )
}

export default page
