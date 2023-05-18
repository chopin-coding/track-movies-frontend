import {useState} from "react";
import CreateMovieForm from './CreateMovieForm'


export default function OperationSelection () {
    const [selectedOption, setSelectedOption] = useState('')

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value)
    }

    return (
        <div>
            <label htmlFor="operation">Select an operation:</label>
            <select id="operation" value={selectedOption} onChange={handleOptionChange}>
                <option value="">Select</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="get">Get</option>
                <option value="delete">Delete</option>
            </select>

            {selectedOption === 'create' && <CreateMovieForm />}

            {selectedOption === 'update' && (
                <div>
                    {/* Additional elements for update operation */}
                </div>
            )}

            {selectedOption === 'get' && (
                <div>
                    {/* Additional elements for get operation */}
                </div>
            )}

            {selectedOption === 'delete' && (
                <div>
                    {/* Additional elements for delete operation */}
                </div>
            )}
        </div>
    )
}