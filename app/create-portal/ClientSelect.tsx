import React, { useState, useEffect, useRef } from 'react';
import styles from './create-portal.module.css';

interface Client {
    id: number;
    name: string;
    email: string;
}

interface ClientSelectProps {
    clients: Client[];
    onSelect: (client: Client | string) => void;
    initialValue?: string;
}

export default function ClientSelect({ clients, onSelect, initialValue = '' }: ClientSelectProps) {
    const [inputValue, setInputValue] = useState(initialValue);
    const [isOpen, setIsOpen] = useState(false);
    const [filteredClients, setFilteredClients] = useState<Client[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInputValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        if (inputValue.trim() === '') {
            setFilteredClients(clients);
        } else {
            setFilteredClients(
                clients.filter(client =>
                    client.name.toLowerCase().includes(inputValue.toLowerCase())
                )
            );
        }
    }, [inputValue, clients]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        setIsOpen(true);
        // If the user types, we essentially reset the "selected client object"
        // and pass just the string name, effectively treating it as a "new client" potential
        // unless they click an option.
        onSelect(value);
    };

    const handleSelectClient = (client: Client) => {
        setInputValue(client.name);
        onSelect(client);
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(prev => (prev < filteredClients.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (isOpen && highlightedIndex >= 0 && highlightedIndex < filteredClients.length) {
                handleSelectClient(filteredClients[highlightedIndex]);
            } else if (isOpen && highlightedIndex === -1 && inputValue) {
                // Trigger selection of current text (new client)
                setIsOpen(false);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    // Check if the current input exactly matches an existing client
    const exactMatch = clients.find(c => c.name.toLowerCase() === inputValue.toLowerCase());

    return (
        <div className={styles.selectWrapper} ref={wrapperRef}>
            <input
                className={styles.input}
                type="text"
                placeholder="Search or enter new client..."
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
                autoFocus
            />

            {isOpen && (inputValue || filteredClients.length > 0) && (
                <ul className={styles.optionsList}>
                    {filteredClients.map((client, index) => (
                        <li
                            key={client.id}
                            className={`${styles.option} ${index === highlightedIndex ? styles.optionHighlighted : ''}`}
                            onClick={() => handleSelectClient(client)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                        >
                            <span className={styles.optionName}>{client.name}</span>
                            <span className={styles.optionEmail}>{client.email}</span>
                        </li>
                    ))}

                    {!exactMatch && inputValue.trim() !== '' && (
                        <li
                            className={`${styles.option} ${styles.newOption}`}
                            onClick={() => {
                                setIsOpen(false);
                                // already passed via onChange, but ensuring close
                            }}
                        >
                            <span className={styles.plusIcon}>+</span>
                            Create new client &quot;<strong>{inputValue}</strong>&quot;
                        </li>
                    )}

                    {filteredClients.length === 0 && inputValue.trim() === '' && (
                        <li className={styles.emptyOption}>Start typing to search...</li>
                    )}
                </ul>
            )}
        </div>
    );
}
