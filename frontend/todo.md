1. Add to object list new object based generation with fields:
 - listPageContent
  - listTitle
  - listDescription
  - leftBar
   - SearchBar
    + sectionTitle
    + sectionDescription
    + sectionItems
     + itemLabel (Like Model Name)
     + itemValue (Like model_name)
     + itemType (Like string)
     + itemDescription (Like Search logs by related model name)
     + itemSuffix (Like icontains)
     + itemParameters (Like list of available parameters)
      + parameterIcon
      + parameterValue
      + parameterLabel
    + itemTypeMaxLength (Like max 6 char)
   - rightBar
    - cardView
     + ...
    - listView
     + itemValue
     + itemLabel
     + itemFlex
2. Add to object list separate lading for left and right page. When page is loading only content of those element should be awaited rest with title should be there.
3. 