import React, { useState, useEffect } from 'react';
import placesData from '../data/places.json';

// Helper function to transform flat data into a hierarchical tree
const buildTree = (data) => {
  const tree = {};
  const rootNodes = [];

  data.forEach(item => {
    let currentNode = tree;
    let path = '';
    for (let i = 1; i <= 5; i++) {
      const level = `Level ${i}`;
      const name = item[level];

      if (!name || name === "No Data") continue;

      path = path ? `${path}/${name}` : name;
      
      if (!currentNode[name]) {
        currentNode[name] = {
          id: path,
          name,
          children: {},
        };
        if (i === 1) {
          rootNodes.push(currentNode[name]);
        }
      }
      currentNode = currentNode[name].children;
    }
  });

  // Convert children objects to arrays
  const convertChildrenToArray = (node) => {
    const childrenAsArray = Object.values(node.children);
    node.children = childrenAsArray;
    childrenAsArray.forEach(convertChildrenToArray);
  };

  const finalTree = { children: {} };
  rootNodes.forEach(node => {
    finalTree.children[node.name] = node;
  });
  
  Object.values(finalTree.children).forEach(convertChildrenToArray);

  return Object.values(finalTree.children);
};


const TreeNode = ({ node, onSelect, selectedPlace }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const isSelected = selectedPlace === node.id;

  return (
    <div className="ml-4">
      <div 
        className={`flex items-center cursor-pointer p-1 rounded ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
        onClick={() => onSelect(node.id)}
      >
        {node.children && node.children.length > 0 && (
          <span onClick={(e) => { e.stopPropagation(); handleToggle(); }} className="mr-1 text-gray-500">
            {isOpen ? '▼' : '►'}
          </span>
        )}
        <span>{node.name}</span>
      </div>
      {isOpen && node.children && node.children.length > 0 && (
        <div className="border-l border-gray-300">
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} onSelect={onSelect} selectedPlace={selectedPlace} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function PlacesTree({ onSelect, selectedPlace }) {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    const tree = buildTree(placesData);
    setTreeData(tree);
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2">Places</h3>
      {treeData.map(node => (
        <TreeNode key={node.id} node={node} onSelect={onSelect} selectedPlace={selectedPlace} />
      ))}
    </div>
  );
}
