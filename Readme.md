# Tag Editor for Neos CMS

Simple add the editor to a property in `NodeTypes.yaml`
```
'Vendor.MyPackage:MyPage':
  ...
  properties:
    tags:
      type: array
      ui:
        label: 'Tags'
        inspector:
          editor: 'ByTorsten.Editors/TagEditor'
```