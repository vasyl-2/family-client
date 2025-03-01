import {ChangeDetectionStrategy, Component, Inject, Input, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {FlatTreeControl, NestedTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource} from "@angular/material/tree";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

import { Chapter } from "../../../models/chapter";

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-edit-chapter',
  templateUrl: './edit-chapter.component.html',
  styleUrls: ['./edit-chapter.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditChapterComponent implements OnInit {

  // private _transformer = (node: Chapter, level: number) => {
  //   return {
  //     expandable: !!node.children && node.children.length > 0,
  //     name: node.nameForUI!,
  //     level: level,
  //   };
  // };

  treeControl = new NestedTreeControl<Chapter>((node) => node.children);
  // treeControl = new FlatTreeControl<ExampleFlatNode>(
  //   node => node.level,
  //   node => node.expandable,
  // );
  //
  // treeFlattener = new MatTreeFlattener(
  //   this._transformer,
  //   node => node.level,
  //   node => node.expandable,
  //   node => node.children
  // );
  dataSource = new MatTreeNestedDataSource<Chapter>();
  // dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    // private chapters: Chapter[],
    @Inject(MAT_DIALOG_DATA) public chapters: Chapter[],
  ) {
  }

  ngOnInit(): void {
    if (this.chapters) {
      this.dataSource.data = this.chapters;
      console.log('TREE__________', this.dataSource.data);
    }
  }

  // hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  hasChild = (_: number, node: Chapter) => !!node.children && node.children.length > 0;

  drop(event: CdkDragDrop<Chapter[]>) {

    const draggedNode = event.item.data;

    let updatedTree = [...this.dataSource.data];
    updatedTree = this.removeNode(updatedTree, draggedNode);

    const newParentArray = event.container.data;

    // Since newParentArray is of type Chapter[], pick the parent node
    const newParent = newParentArray.find(parent => parent.children) || { children: [] };  // Safeguard if no parent found

    // Add to the new parent
    updatedTree = this.addNode(updatedTree, newParent, draggedNode);

    // Update the data source (triggers change detection)
    this.dataSource.data = updatedTree;

    console.log('EVENT_____1', event);
    console.log('EVENT_____2', event.item);

    console.log('draggedNode________________', draggedNode);

    // let previousParent = this.findParent(this.dataSource.data, draggedNode);
    // const newParent = event.container.data;
    console.log('NRW__PARET____', newParent)

    // if (previousParent) {
    //   // Remove from old parent
    //   console.log('PARENT____', previousParent)
    //   const updatedParent = { ...previousParent, children: previousParent.children!.filter(child => child !== draggedNode) };
    //
    //   // ✅ Update the reference in the tree
    //   this.replaceNode(this.dataSource.data, previousParent, updatedParent);
    //
    // } else {
    //   // If no parent, it's a root-level move
    //   this.dataSource.data = this.dataSource.data.filter((node: Chapter) => node !== draggedNode);
    // }

    // Add to the new parent (or root if dropped at root level)
    // newParent.push(draggedNode);

    // console.log('After move:', JSON.stringify(this.dataSource.data, null, 2));
    // Refresh tree data
    // this.dataSource.data = [...this.dataSource.data];
  }

  addNode(tree: Chapter[], parentNode: Chapter, newNode: Chapter): Chapter[] {
    return tree.map(node => {
      if (node === parentNode) {
        return {
          ...node,
          children: [...(node.children || []), newNode] // ✅ Add without modifying original
        };
      } else if (node.children) {
        return {
          ...node,
          children: this.addNode(node.children, parentNode, newNode) // Recursive call
        };
      }
      return node;
    });
  }


  removeNode(tree: Chapter[], targetNode: Chapter): Chapter[] {
    return tree
      .map(node => ({
        ...node,
        children: node.children ? this.removeNode(node.children, targetNode) : []
      }))
      .filter(node => node !== targetNode); // Remove if it's the node itself
  }

  /** Recursively finds the parent of a node */
  findParent(nodes: Chapter[], target: Chapter): Chapter | null {
    for (const node of nodes) {
      if (node.children?.includes(target)) {
        return node; // Found parent
      }
      const found = this.findParent(node.children || [], target);
      if (found) return found;
    }
    return null;
  }

  replaceNode(tree: Chapter[], oldNode: Chapter, newNode: Chapter) {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i] === oldNode) {
        tree[i] = newNode;
        return;
      } else if (tree[i].children) {
        this.replaceNode(tree[i].children!, oldNode, newNode);
      }
    }
  }
  // drop(event: CdkDragDrop<ExampleFlatNode[]>) {
  //   console.log('EVENT____', event);
  //   if (event.previousIndex === event.currentIndex) {
  //     return; // No change in position
  //   }
  //
  //   // Reorder in the tree data
  //   const data = this.treeControl.dataNodes;
  //   moveItemInArray(data, event.previousIndex, event.currentIndex);
  //
  //   // Update tree control and UI
  //   this.treeControl.dataNodes = [...data];
  //   this.treeControl.expandAll(); // Refresh UI
  //
  //   // Update the original hierarchical data (this is needed!)
  //   this.updateHierarchy();
  // }

  /** Rebuilds the nested structure from the flat list */
  // updateHierarchy() {
  //   const flatNodes = this.treeControl.dataNodes;
  //   const nestedData: Chapter[] = [];
  //
  //   const map = new Map<string, Chapter>();
  //
  //   // Convert flat list back to hierarchical structure
  //   flatNodes.forEach((node: ExampleFlatNode) => {
  //     const newNode: Chapter = { nameForUI: node.name, children: [] };
  //     map.set(node.name, newNode);
  //
  //     if (node.level === 0) {
  //       nestedData.push(newNode);
  //       console.log('0_________________')
  //     } else {
  //       console.log('1_________________')
  //       const parent = flatNodes.find((p: ExampleFlatNode) =>  {
  //         console.log('P_____', p,'------', node)
  //         return p.name === node.name && p.level === node.level - 1;
  //       });
  //       console.log('PARENT_________', parent)
  //       if (parent) {
  //         map.get(parent.name)?.children?.push(newNode);
  //       }
  //     }
  //   });
  //
  //   console.log('NESTED)))NODES_____', nestedData)
  //   // Update the original tree data source
  //   this.dataSource.data = nestedData;
  // }
}
